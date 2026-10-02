/** Parse R2 产品介绍.txt and produce English catalog copy. */

const FIELD_LABELS = {
  品牌: 'Brand',
  比例: 'Scale',
  材质: 'Material',
  功能: 'Features',
  尺寸: 'Dimensions',
  包装: 'Packaging',
  介绍: 'Overview',
};

const PHRASES = [
  ['太阳星', 'Sun Star'],
  ['斯巴鲁', 'Subaru'],
  ['翼豹', 'Impreza'],
  ['保时捷', 'Porsche'],
  ['大众', 'Volkswagen'],
  ['奔驰', 'Mercedes-Benz'],
  ['阿尔法', 'Alfa Romeo'],
  ['合金汽车模型', 'diecast model'],
  ['合金模型', 'diecast model'],
  ['跑车', 'sports car'],
  ['拉力赛车', 'rally car'],
  ['回到未来原型车', 'Back to the Future Prototype'],
  ['回到未来', 'Back to the Future'],
  ['原型车', ' Prototype'],
  ['WRC拉力赛车', 'WRC Rally Car'],
  ['WRC97拉力赛车', 'WRC97 Rally Car'],
  ['车身合金', 'diecast metal body'],
  ['底盘和内部结构塑料', 'plastic chassis and interior'],
  ['底盘合金', 'metal chassis'],
  ['车轮橡胶', 'rubber tires'],
  ['全部车门可开', 'All doors open'],
  ['前轮转向联动方向盘', 'Steering wheel linked to front wheels'],
  ['车轮带减震', 'Suspension on wheels'],
  ['车轮没有减震', 'No suspension on wheels'],
  ['内植绒', 'Flocked interior'],
  ['内部泡沫盒外部彩盒', 'Foam inner tray with outer colour box'],
  ['内部泡沫盒外纸盒', 'Foam inner tray with outer carton'],
  ['泡沫盒', 'Foam tray packaging'],
  ['半透明包装盒自带底座', 'Semi-transparent display box with base'],
  ['透明盒带底座', 'Clear display case with base'],
  ['模型长约', 'Length approx. '],
  ['宽约', ', width approx. '],
  ['高约', ', height approx. '],
  ['厘米', ' cm'],
  ['淘宝常规价', 'Reference retail (CNY) '],
  ['常规价', 'Reference retail (CNY) '],
  ['麦克雷', 'Colin McRae'],
  ['伯恩斯', 'Richard Burns'],
  ['科林', 'Colin '],
  ['理查德', 'Richard '],
  ['WRC拉力赛车', 'WRC rally car'],
  ['WRC97拉力赛车', 'WRC97 rally car'],
  ['发动机后置', 'Rear-engine layout'],
  ['发动机舱内盖板可打开', 'Opening engine bay panel'],
  ['全封闭不能开门', 'Sealed body (doors do not open)'],
  ['附带车顶盖', 'Removable hardtop included'],
  ['车头进气格栅镂空', 'Open grille mesh'],
  ['前盖镂空', 'Open front vent detail'],
];

/** Hand-polished overview text where auto-replace is weak. */
export const OVERVIEW_EN = {
  'r2-06':
    '2000 WRC Rally of Portugal winner driven by Richard Burns. Burns often removed the left mirror on his rally cars; the model correctly omits the left mirror.',
  'r2-07':
    '1997 WRC RAC Rally of Great Britain winner driven by Colin McRae. McRae preferred to remove the right mirror; the model omits the right mirror.',
  'r2-13':
    'DeLorean DMC-12 as the Back to the Future hero car. Opening doors; steering linked to the front wheels. Semi-transparent display packaging with base.',
  'r2-15':
    '1993 Porsche 911 Speedster in 1:18 scale by NOREV. Opening doors, flocked interior, steering function. Foam tray packaging.',
  'r2-22':
    '1963 Volkswagen Karmann Ghia 1500 by NOREV. Rear-engine layout with opening engine bay panel. All doors open with steering function.',
  'r2-28':
    '1975 Mercedes-Benz R107 450SL by NOREV. Opening doors, flocked interior, removable hardtop included. Clear display case with base.',
  'r2-30':
    '1964 Alfa Romeo Giulia TI by NOREV. Sealed body (doors do not open) with steering. Semi-transparent display case with base.',
};

export function parseIntroTxt(raw) {
  if (!raw?.trim()) return { specs: {}, overviewZh: '' };
  const specs = {};
  let overviewZh = '';
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^【([^】]+)】(.*)$/);
    if (!m) continue;
    const [, key, value] = m;
    const trimmed = value.trim();
    if (key === '介绍') overviewZh = trimmed;
    else if (FIELD_LABELS[key]) specs[FIELD_LABELS[key]] = trimmed;
  }
  return { specs, overviewZh };
}

function applyPhrases(text) {
  let out = text;
  for (const [zh, en] of PHRASES) {
    out = out.split(zh).join(en);
  }
  return out.replace(/\s+/g, ' ').trim();
}

export function translateSpecsValues(specs) {
  const en = {};
  for (const [k, v] of Object.entries(specs)) {
    en[k] = applyPhrases(v);
  }
  return en;
}

export function englishTitleFromFolder(folderName) {
  let t = folderName.replace(/^\d+[-_\s]+/, '').trim();
  t = applyPhrases(t);
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

export function extractYear(text) {
  const m = text.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : '';
}

export function extractBrand(title, specs) {
  const brandSpec = specs.Brand || specs['Brand'];
  if (brandSpec) {
    const b = applyPhrases(brandSpec);
    if (/NOREV/i.test(b)) return { brand: 'NOREV', brandShort: 'NOREV' };
    if (/Sun Star|SunStar/i.test(b)) return { brand: 'Sun Star', brandShort: 'Sun Star' };
  }
  if (/NOREV/i.test(title)) return { brand: 'NOREV', brandShort: 'NOREV' };
  if (/Sun Star/i.test(title)) return { brand: 'Sun Star', brandShort: 'Sun Star' };
  return { brand: 'Driftae Collection', brandShort: 'Driftae' };
}

export function buildEnglishCopy({ productId, folderName, introRaw }) {
  const name = englishTitleFromFolder(folderName);
  const year = extractYear(folderName + ' ' + name);
  const { specs, overviewZh } = parseIntroTxt(introRaw);
  const specsEn = translateSpecsValues(specs);
  const { brand, brandShort } = extractBrand(name, specsEn);

  let description =
    OVERVIEW_EN[productId] ||
    (overviewZh ? applyPhrases(overviewZh) : '') ||
    `1:18 scale ${name}.`;

  description = description.replace(/Reference retail \(CNY\) \d+/g, '').trim();

  return { name, brand, brandShort, year, specs: specsEn, description };
}
