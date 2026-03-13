/**
 * Граф рекомендаций.
 *
 * Рёбра определяются один раз как пары — граф всегда двунаправленный.
 * Синонимы задаются группами — внутри группы все узлы соединяются попарно.
 * Рекомендации = BFS от введённых тегов, возвращаем ближайших соседей.
 */

type Edge = readonly [string, string];

// ─── Инфраструктура ──────────────────────────────────────────────────────────

function buildGraph(edges: Edge[]): Map<string, string[]> {
  const adj = new Map<string, Set<string>>();

  const link = (a: string, b: string) => {
    const ka = a.toLowerCase();
    const kb = b.toLowerCase();
    if (!adj.has(ka)) adj.set(ka, new Set());
    if (!adj.has(kb)) adj.set(kb, new Set());
    adj.get(ka)!.add(b);
    adj.get(kb)!.add(a);
  };

  for (const [a, b] of edges) link(a, b);

  const result = new Map<string, string[]>();
  for (const [key, set] of adj) result.set(key, [...set]);
  return result;
}

/** Из группы синонимов генерируем все попарные рёбра */
function synonymEdges(group: string[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < group.length; i++)
    for (let j = i + 1; j < group.length; j++)
      edges.push([group[i], group[j]]);
  return edges;
}

/** BFS от нескольких стартовых узлов, возвращает соседей до глубины depth */
function bfs(graph: Map<string, string[]>, starts: string[], depth = 1): string[] {
  const startSet = new Set(starts.map(s => s.toLowerCase()));
  const visited = new Set<string>(startSet);
  const result: string[] = [];
  let frontier = [...startSet];

  for (let d = 0; d < depth; d++) {
    const next: string[] = [];
    for (const node of frontier) {
      for (const neighbor of graph.get(node) ?? []) {
        const nl = neighbor.toLowerCase();
        if (!visited.has(nl)) {
          visited.add(nl);
          result.push(neighbor);
          next.push(nl);
        }
      }
    }
    frontier = next;
    if (!frontier.length) break;
  }

  return result;
}

function lookup(graph: Map<string, string[]>, tags: string[], depth = 1): string[] {
  return bfs(graph, tags, depth).slice(0, 5);
}

// ─── Граф грейдов ─────────────────────────────────────────────────────────────
//
// Синонимы: всё внутри группы связано между собой.
// Прогрессия: цепочка intern → junior → ... → principal.

const gradeEdges: Edge[] = [
  // Синонимы
  ...synonymEdges(['intern', 'trainee', 'стажёр']),
  ...synonymEdges(['junior', 'джун', 'джуниор', 'младший']),
  ...synonymEdges(['middle', 'мидл']),
  ...synonymEdges(['senior', 'сеньор', 'старший']),
  ...synonymEdges(['principal', 'ведущий']),
  ...synonymEdges(['lead', 'тимлид']),
  ...synonymEdges(['tech lead', 'техлид']),
  ...synonymEdges(['team lead', 'тимлид']),

  // Прогрессия уровней
  ['intern',    'junior'],
  ['junior',    'junior+'],
  ['junior+',   'middle'],
  ['middle',    'middle+'],
  ['middle+',   'senior'],
  ['senior',    'senior+'],
  ['senior+',   'staff'],
  ['staff',     'principal'],

  // Переходы к лидерским ролям
  ['senior',    'lead'],
  ['senior',    'tech lead'],
  ['lead',      'tech lead'],
  ['tech lead', 'architect'],
];

const gradeGraph = buildGraph(gradeEdges);

// ─── Граф профессий ───────────────────────────────────────────────────────────

const titleEdges: Edge[] = [
  // Синонимы EN ↔ RU
  ...synonymEdges(['developer', 'разработчик', 'программист']),
  ...synonymEdges(['engineer', 'инженер']),
  ...synonymEdges(['software developer', 'software engineer', 'разработчик программного обеспечения']),
  ...synonymEdges(['frontend developer', 'фронтенд разработчик', 'верстальщик']),
  ...synonymEdges(['backend developer', 'бэкенд разработчик', 'серверный разработчик']),
  ...synonymEdges(['fullstack developer', 'фулстек разработчик']),
  ...synonymEdges(['mobile developer', 'мобильный разработчик']),
  ...synonymEdges(['ios developer', 'iOS разработчик']),
  ...synonymEdges(['android developer', 'Android разработчик']),
  ...synonymEdges(['team lead', 'тимлид']),
  ...synonymEdges(['tech lead', 'техлид']),
  ...synonymEdges(['architect', 'архитектор']),
  ...synonymEdges(['solution architect', 'архитектор решений']),
  ...synonymEdges(['project manager', 'менеджер проекта']),
  ...synonymEdges(['product manager', 'продуктовый менеджер', 'продакт менеджер']),
  ...synonymEdges(['product owner', 'владелец продукта']),
  ...synonymEdges(['analyst', 'аналитик']),
  ...synonymEdges(['business analyst', 'бизнес-аналитик']),
  ...synonymEdges(['system analyst', 'системный аналитик']),
  ...synonymEdges(['data analyst', 'аналитик данных']),
  ...synonymEdges(['data scientist', 'дата-сайентист']),
  ...synonymEdges(['data engineer', 'дата-инженер']),
  ...synonymEdges(['ml engineer', 'ML инженер', 'инженер машинного обучения']),
  ...synonymEdges(['qa engineer', 'QA инженер', 'тестировщик', 'инженер по тестированию']),
  ...synonymEdges(['devops engineer', 'девопс инженер']),
  ...synonymEdges(['designer', 'дизайнер']),
  ...synonymEdges(['ui designer', 'UI дизайнер']),
  ...synonymEdges(['ux designer', 'UX дизайнер']),
  ...synonymEdges(['ui/ux designer', 'UI/UX дизайнер']),
  ...synonymEdges(['product designer', 'продуктовый дизайнер']),
  ...synonymEdges(['graphic designer', 'графический дизайнер']),
  ...synonymEdges(['motion designer', 'моушн дизайнер']),
  ...synonymEdges(['3d designer', '3D дизайнер', '3d artist', '3D художник']),
  ...synonymEdges(['art director', 'арт-директор']),
  ...synonymEdges(['recruiter', 'рекрутер']),

  // Связанные роли
  ['frontend developer',  'backend developer'],
  ['frontend developer',  'fullstack developer'],
  ['backend developer',   'fullstack developer'],
  ['ios developer',       'android developer'],
  ['ios developer',       'mobile developer'],
  ['android developer',   'mobile developer'],
  ['data analyst',        'data scientist'],
  ['data scientist',      'ml engineer'],
  ['data engineer',       'data scientist'],
  ['qa engineer',         'sdet'],
  ['devops engineer',     'sre'],
  ['devops engineer',     'platform engineer'],
  ['team lead',           'tech lead'],
  ['tech lead',           'architect'],
  ['architect',           'solution architect'],
  ['product manager',     'product owner'],
  ['product manager',     'project manager'],
  ['business analyst',    'system analyst'],
  ['ui designer',         'ux designer'],
  ['ui/ux designer',      'product designer'],
  ['graphic designer',    'brand designer'],
  ['motion designer',     '3d designer'],
  ['recruiter',           'sourcer'],
];

const titleGraph = buildGraph(titleEdges);

// ─── Граф навыков ─────────────────────────────────────────────────────────────

const skillEdges: Edge[] = [
  // Frontend
  ['react',         'typescript'],
  ['react',         'next.js'],
  ['react',         'redux'],
  ['react',         'tailwind css'],
  ['vue',           'typescript'],
  ['vue',           'nuxt'],
  ['vue',           'pinia'],
  ['angular',       'typescript'],
  ['angular',       'rxjs'],
  ['svelte',        'sveltekit'],
  ['next.js',       'vercel'],
  ['tailwind css',  'css'],
  ['three.js',      'webgl'],
  ['three.js',      'gsap'],
  ['gsap',          'framer motion'],

  // Backend
  ['python',    'django'],
  ['python',    'fastapi'],
  ['python',    'flask'],
  ['golang',    'grpc'],
  ['golang',    'kubernetes'],
  ['java',      'spring'],
  ['java',      'kotlin'],
  ['node.js',   'express'],
  ['node.js',   'nestjs'],
  ['rust',      'webassembly'],
  ['c++',       'unreal engine'],
  ['c#',        '.net'],
  ['c#',        'unity'],
  ['php',       'laravel'],
  ['ruby',      'rails'],

  // Infra
  ['docker',      'kubernetes'],
  ['kubernetes',  'helm'],
  ['kubernetes',  'terraform'],
  ['terraform',   'aws'],
  ['terraform',   'gcp'],
  ['terraform',   'azure'],
  ['aws',         'lambda'],
  ['prometheus',  'grafana'],

  // DB
  ['postgresql',  'redis'],
  ['postgresql',  'mongodb'],
  ['kafka',       'rabbitmq'],
  ['elasticsearch', 'kibana'],

  // Design — UI/UX
  ['figma',           'sketch'],
  ['figma',           'adobe xd'],
  ['figma',           'zeplin'],
  ['figma',           'protopie'],
  ['figma',           'framer'],
  ['adobe xd',        'protopie'],
  ['design systems',  'storybook'],
  ['protopie',        'principle'],
  ['lottie',          'rive'],
  ['lottie',          'after effects'],

  // Design — Graphic
  ['adobe photoshop',   'adobe illustrator'],
  ['adobe illustrator', 'adobe indesign'],
  ['canva',             'figma'],
  ['procreate',         'adobe illustrator'],

  // Design — 3D
  ['blender',          'cinema 4d'],
  ['blender',          'substance painter'],
  ['cinema 4d',        'after effects'],
  ['cinema 4d',        'houdini'],
  ['autodesk maya',    'zbrush'],
  ['autodesk maya',    '3ds max'],
  ['zbrush',           'substance painter'],
  ['unreal engine',    'unity'],
  ['houdini',          'nuke'],
  ['v-ray',            'corona renderer'],
  ['sketchup',         'lumion'],

  // Design — Motion
  ['after effects', 'premiere pro'],
  ['premiere pro',  'davinci resolve'],
  ['rive',          'framer motion'],
  ['spine',         'unity'],
];

const skillGraph = buildGraph(skillEdges);

// ─── Публичные функции ────────────────────────────────────────────────────────

export function getRelatedSuggestions(tags: string[]): string[] {
  // Сначала пробуем граф профессий, затем граф навыков
  const fromTitles = lookup(titleGraph, tags);
  if (fromTitles.length) return fromTitles;
  return lookup(skillGraph, tags);
}

export function getExcludeRelated(tags: string[]): string[] {
  return lookup(gradeGraph, tags);
}

export function getGradeRelated(tags: string[]): string[] {
  return lookup(gradeGraph, tags);
}
