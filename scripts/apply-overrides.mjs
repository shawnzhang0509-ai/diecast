#!/usr/bin/env node
/** Re-apply product-overrides.json to public/products.json without listing R2 (same merge as sync:r2). */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = join(root, 'public', 'products.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const { _comment, ...overrides } = JSON.parse(readFileSync(join(root, 'product-overrides.json'), 'utf8'));

let changed = 0;
catalog.products = catalog.products.map((p) => {
  const o = overrides[p.id];
  if (!o) return p;
  changed += 1;
  const { specs, tags, ...rest } = o;
  return {
    ...p,
    ...rest,
    specs: { ...p.specs, ...(specs ?? {}) },
    tags: [...new Set([...(p.tags ?? []), ...(tags ?? []), ...(o.marque ? [`marque:${o.marque}`] : [])])],
  };
});

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`applied overrides to ${changed} products`);
