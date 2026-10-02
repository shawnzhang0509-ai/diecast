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

  for (const arr of groups.values()) {
    arr.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  }

  return groups;
}

function titleFromKey(key, groupKey) {
  const filename = key.split('/').pop() ?? key;
  let name = filename.replace(IMAGE_EXT, '');
  name = name.replace(/^\d+[-_\s]+/, '');
  return name.trim() || groupKey;
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

  const products = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .map(([groupKey, keysForProduct]) => {
      const primaryKey = keysForProduct[0];
      const name = titleFromKey(primaryKey, groupKey);
      const images = keysForProduct.map(publicUrlFromKey);
      const id = slugId(groupKey);
      const o = overrides[id] ?? {};

      return {
        id,
        name: o.name ?? name,
        brand: o.brand ?? 'Driftae',
        brandShort: o.brandShort ?? 'Driftae',
        year: o.year ?? '',
        mileage: o.mileage ?? '',
        price: typeof o.price === 'number' ? o.price : 0,
        image: images[0],
        images,
        status: o.status ?? 'instock',
        description: o.description ?? name,
        specs: o.specs ?? {},
        tags: o.tags ?? [],
      };
    });

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
