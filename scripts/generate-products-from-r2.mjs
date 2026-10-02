#!/usr/bin/env node
/**
 * List images in R2 → public/products.json (+ merge product-overrides.json).
 *
 *   cp .env.example .env.local   # fill R2 keys once
 *   npm run sync:r2
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildEnglishCopy } from './product-copy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const BUCKET = process.env.R2_BUCKET ?? 'driftae';
const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE ?? '').replace(/\/$/, '');
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

async function listAllKeys() {
  if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
    console.error('Missing R2 credentials. Copy .env.example → .env.local and fill in values.');
    process.exit(1);
  }

  const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  });

  const keys = [];
  let token;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key && !obj.Key.endsWith('/')) keys.push(obj.Key);
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  return keys;
}

function publicUrlFromKey(key) {
  return `${PUBLIC_BASE}/${key.split('/').map((s) => encodeURIComponent(s)).join('/')}`;
}

function slugId(raw) {
  return `r2-${raw}`.replace(/[^\w-]+/g, '-').toLowerCase();
}

/** Folder `06-太阳星…/` → stable id `r2-06` (relist-safe). */
function stableIdFromGroupKey(groupKey) {
  const num = groupKey.match(/^(\d+)/);
  if (num) return `r2-${num[1].padStart(2, '0')}`;
  return slugId(groupKey);
}

function titleFromGroupKey(groupKey) {
  return groupKey.replace(/^\d+[-_\s]+/, '').trim() || groupKey;
}

function sortImageKeys(keys) {
  const rank = (key) => {
    const base = key.split('/').pop() ?? key;
    if (/主图/i.test(base)) return 0;
    if (/cover/i.test(base)) return 1;
    if (/^webwx/i.test(base)) return 2;
    if (/^\d+\.(jpe?g|png|webp)$/i.test(base)) return 4;
    return 3;
  };
  return [...keys].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'en', { numeric: true }));
}

function groupIntoProducts(keys) {
  const imageKeys = keys.filter((k) => IMAGE_EXT.test(k) && k !== 'products.json');
  const groups = new Map();

  for (const key of imageKeys) {
    const filename = key.split('/').pop() ?? key;
    const numMatch = filename.match(/^(\d+)[-_\s]/);
    const groupKey = key.includes('/')
      ? key.split('/')[0]
      : numMatch
        ? numMatch[1].padStart(2, '0')
        : filename.replace(IMAGE_EXT, '');

    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(key);
  }

  for (const [k, arr] of groups) {
    groups.set(k, sortImageKeys(arr));
  }

  return groups;
}

function loadOverrides() {
  try {
    const raw = JSON.parse(readFileSync(join(root, 'product-overrides.json'), 'utf8'));
    const { _comment, ...rest } = raw;
    return rest;
  } catch {
    return {};
  }
}

async function main() {
  if (!PUBLIC_BASE) {
    console.error('Set R2_PUBLIC_BASE in .env.local');
    process.exit(1);
  }

  const overrides = loadOverrides();
  const keys = await listAllKeys();
  const groups = groupIntoProducts(keys);

  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  });

  async function readIntro(groupKey) {
    const introKey = keys.find(
      (k) => k.startsWith(`${groupKey}/`) && /产品介绍\.txt$/i.test(k),
    );
    if (!introKey) return '';
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: introKey }));
      return await res.Body.transformToString('utf8');
    } catch {
      return '';
    }
  }

  const entries = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );

  const products = await Promise.all(
    entries.map(async ([groupKey, keysForProduct]) => {
      const images = keysForProduct.map(publicUrlFromKey);
      const id = stableIdFromGroupKey(groupKey);
      const introRaw = await readIntro(groupKey);
      const en = buildEnglishCopy({ productId: id, folderName: groupKey, introRaw });
      const o = overrides[id] ?? {};

      return {
        id,
        name: o.name ?? en.name,
        brand: o.brand ?? en.brand,
        brandShort: o.brandShort ?? en.brandShort,
        year: o.year ?? en.year,
        mileage: '',
        price: typeof o.price === 'number' ? o.price : 0,
        image: images[0],
        images,
        status: o.status ?? 'instock',
        description: o.description ?? en.description,
        specs: { ...en.specs, ...(o.specs ?? {}) },
        marque: o.marque ?? en.marque,
        vehicleModel: o.vehicleModel ?? en.vehicleModel,
        tags: [...new Set([...(en.tags ?? []), ...(o.tags ?? [])])],
      };
    }),
  );

  const outPath = join(root, 'public', 'products.json');
  const catalogBody = JSON.stringify(
    { generatedAt: new Date().toISOString(), products },
    null,
    2,
  );
  writeFileSync(outPath, catalogBody);
  console.log(
    `✓ ${products.length} products, ${keys.filter((k) => IMAGE_EXT.test(k)).length} images → public/products.json`,
  );

  if (process.env.R2_UPLOAD_CATALOG === '1') {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: 'products.json',
        Body: catalogBody,
        ContentType: 'application/json',
      }),
    );
    console.log(`✓ uploaded products.json → r2://${BUCKET}/products.json`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
