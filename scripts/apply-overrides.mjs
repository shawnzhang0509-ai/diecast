#!/usr/bin/env node
/** Re-apply product-overrides.json (_renames + per-product fixes) to public/products.json without listing R2 (same merge as sync:r2). */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = join(root, 'public', 'products.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const { _comment, _renames = {}, ...overrides } = JSON.parse(readFileSync(join(root, 'product-overrides.json'), 'utf8'));

let changed = 0;
catalog.products = catalog.products.map((p0) => {
  const p = _renames[p0.id] ? { ...p0, id: _renames[p0.id] } : p0;
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

// Products without an R2 folder (extra-products.json) replace any earlier copy of themselves.
const extra = JSON.parse(readFileSync(join(root, 'extra-products.json'), 'utf8')).products ?? [];
const extraIds = new Set(extra.map((p) => p.id));
catalog.products = [...catalog.products.filter((p) => !extraIds.has(p.id)), ...extra];

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`applied overrides to ${changed} products, ${extra.length} extra products`);
