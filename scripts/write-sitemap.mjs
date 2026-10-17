#!/usr/bin/env node
/** After `vite build`: dist/sitemap.xml from public/products.json (home, collection, about, every product). */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://www.driftae.com';
const { products = [] } = JSON.parse(readFileSync(join(root, 'public', 'products.json'), 'utf8'));
const paths = ['/', '/collection', '/about', ...products.map((p) => `/product/${encodeURIComponent(p.id)}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(root, 'dist', 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${paths.length} urls`);
