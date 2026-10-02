#!/usr/bin/env node
/**
 * Fetch live prices (and sold state) from Trade Me for mapped listings.
 *
 * Setup: https://developer.trademe.co.nz — register app + OAuth token (seller account).
 *
 * Env (.env.local):
 *   TRADEME_CONSUMER_KEY=
 *   TRADEME_CONSUMER_SECRET=
 *   TRADEME_ACCESS_TOKEN=
 *   TRADEME_ACCESS_TOKEN_SECRET=
 *   TRADEME_MEMBER_LISTING=5600782   # optional, for listing all + suggest map
 *
 * Map file: trademe-product-map.json  { "r2-06": { "listingId": 123... } }
 * Output:    public/trademe-links.json (enable VITE_TRADEME_LINKS=true on site)
 *
 *   npm run sync:trademe
 */

import crypto from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import OAuth from 'oauth-1.0a';

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

const CONSUMER_KEY = process.env.TRADEME_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TRADEME_CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.TRADEME_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TRADEME_ACCESS_TOKEN_SECRET;
const MEMBER_LISTING = process.env.TRADEME_MEMBER_LISTING || '5600782';

function requireCreds() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET || !ACCESS_TOKEN || !ACCESS_TOKEN_SECRET) {
    console.error(`
Missing Trade Me OAuth credentials in .env.local:

  TRADEME_CONSUMER_KEY=
  TRADEME_CONSUMER_SECRET=
  TRADEME_ACCESS_TOKEN=
  TRADEME_ACCESS_TOKEN_SECRET=

Register at https://developer.trademe.co.nz and authorize with your seller account.
`);
    process.exit(1);
  }
}

const oauth = OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: 'HMAC-SHA1',
  hash_function(base, key) {
    return crypto.createHmac('sha1', key).update(base).digest('base64');
  },
});

async function trademeGet(path, query = {}) {
  const url = new URL(`https://api.trademe.co.nz/v1/${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v != null && v !== '') url.searchParams.set(k, String(v));
  }
  const requestData = { url: url.toString(), method: 'GET' };
  const authHeader = oauth.toHeader(
    oauth.authorize(requestData, { key: ACCESS_TOKEN, secret: ACCESS_TOKEN_SECRET }),
  );
  const res = await fetch(url, { headers: { ...authHeader } });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Trade Me API ${res.status}: ${text.slice(0, 400)}`);
  }
  return JSON.parse(text);
}

function loadProductMap() {
  const raw = JSON.parse(readFileSync(join(root, 'trademe-product-map.json'), 'utf8'));
  return Object.fromEntries(
    Object.entries(raw).filter(([k]) => !k.startsWith('_')),
  );
}

function loadExistingLinks() {
  try {
    const raw = JSON.parse(readFileSync(join(root, 'public', 'trademe-links.json'), 'utf8'));
    return Object.fromEntries(
      Object.entries(raw).filter(([k]) => !k.startsWith('_')),
    );
  } catch {
    return {};
  }
}

function pickPrice(listing) {
  const buyNow = listing.BuyNowPrice ?? listing.BuyNowPriceDisplay;
  if (buyNow != null && Number(buyNow) > 0) return Number(buyNow);
  const start = listing.StartPrice ?? listing.StartPriceDisplay;
  if (start != null && Number(start) > 0) return Number(start);
  const price = listing.Price ?? listing.CurrentPrice;
  if (price != null && Number(price) > 0) return Number(price);
  return 0;
}

function isSold(listing) {
  if (listing.IsSold === true) return true;
  if (listing.Status === 'Sold' || listing.ListingStatus === 'Sold') return true;
  return false;
}

async function fetchAllMemberListings() {
  const byId = new Map();
  let page = 1;
  let total = Infinity;
  while ((page - 1) * 50 < total) {
    const data = await trademeGet('Search/General.json', {
      member_listing: MEMBER_LISTING,
      page,
      rows: 50,
    });
    const list = data.List ?? data.Listings ?? [];
    total = data.TotalCount ?? list.length;
    for (const item of list) {
      const id = item.ListingId ?? item.Id;
      if (id) byId.set(String(id), item);
    }
    if (list.length === 0) break;
    page += 1;
  }
  return byId;
}

async function main() {
  requireCreds();
  const productMap = loadProductMap();
  const keys = Object.keys(productMap);
  if (keys.length === 0) {
    console.error('Add at least one mapping in trademe-product-map.json (e.g. "r2-06": { "listingId": ... })');
    process.exit(1);
  }

  console.log(`Fetching seller listings (member ${MEMBER_LISTING})…`);
  const byListingId = await fetchAllMemberListings();
  console.log(`  ${byListingId.size} listings from Trade Me`);

  const out = loadExistingLinks();

  for (const productId of keys) {
    const { listingId } = productMap[productId];
    if (!listingId) continue;
    const listing = byListingId.get(String(listingId));
    if (!listing) {
      console.warn(`  ⚠ ${productId}: listing ${listingId} not found (ended or wrong id?)`);
      out[productId] = {
        ...out[productId],
        listingId,
        sold: true,
      };
      continue;
    }

    const price = pickPrice(listing);
    const sold = isSold(listing);
    out[productId] = {
      listingId: Number(listingId),
      price,
      ...(sold ? { sold: true } : { status: 'instock' }),
    };
    const title = listing.Title ?? '';
    console.log(`  ✓ ${productId} → NZ$${price}${sold ? ' (sold)' : ''}  ${title.slice(0, 50)}`);
  }

  const outPath = join(root, 'public', 'trademe-links.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log('Deploy with VITE_TRADEME_LINKS=true so the site loads prices + Buy links.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
