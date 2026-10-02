/** Vehicle marque + model parsing (shared by R2 sync). */

export const MAKERS = /\b(Sun Star|NOREV|MINI GT|AutoArt|Kyosho|OttOmobile|Ignition Model)\b/gi;

export const MARQUES = [
  'Mercedes-Benz',
  'Alfa Romeo',
  'Aston Martin',
  'Land Rover',
  'DeLorean',
  'Volkswagen',
  'Lamborghini',
  'Porsche',
  'Ferrari',
  'McLaren',
  'Subaru',
  'Bugatti',
  'Jaguar',
  'Bentley',
  'Rolls-Royce',
  'Audi',
  'Ford',
  'BMW',
  'MINI',
  'Peugeot',
  'Jeep',
  'Toyota',
  'Nissan',
  'Honda',
  'Citroën',
  'Citroen',
];

export function extractMarqueFromTitle(title) {
  const cleaned = title.replace(MAKERS, ' ').replace(/\s+/g, ' ').trim();
  for (const m of MARQUES) {
    const re = new RegExp(`\\b${m.replace(/-/g, '[- ]')}\\b`, 'i');
    if (re.test(cleaned)) {
      if (/\bMustang\b/i.test(cleaned) && !/\bFord\b/i.test(cleaned)) return 'Ford';
      return m === 'Citroen' ? 'Citroën' : m;
    }
  }
  if (/\bMustang\b/i.test(cleaned)) return 'Ford';
  return '';
}

export function extractVehicleModel(title, marque) {
  if (!marque) return '';
  let t = title.replace(MAKERS, ' ').replace(/\s+diecast model$/i, '').replace(/\s+/g, ' ').trim();
  const re = new RegExp(`\\b${marque.replace(/-/g, '[- ]')}\\b`, 'i');
  const m = t.match(re);
  if (!m) return '';
  let rest = t.slice(m.index + m[0].length).trim();
  rest = rest.replace(/^(19|20)\d{2}\s*/, '');
  const yearCut = rest.match(/\s+(19|20)\d{2}\b/);
  if (yearCut) rest = rest.slice(0, yearCut.index).trim();
  rest = rest
    .replace(/\s+(sports car|rally car|wrc[^]*|prototype|diecast).*$/i, '')
    .replace(/\s+Back to the Future.*$/i, '')
    .trim();
  return rest;
}

export function marqueTags(marque) {
  if (!marque) return [];
  return [`marque:${marque}`, marque.toLowerCase().replace(/\s+/g, '-')];
}
