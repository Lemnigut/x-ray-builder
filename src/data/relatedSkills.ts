/**
 * Связанные подсказки: когда добавлен тег-ключ — предлагаем значения.
 * Работает и для Job Titles (EN↔RU + смежные роли), и для скиллов.
 * Ключи хранятся в lowercase.
 */
const related: Record<string, string[]> = {
  // ── Job Titles: EN → RU + смежные ──
  'developer':            ['разработчик', 'engineer', 'программист'],
  'разработчик':          ['developer', 'engineer', 'программист'],
  'software developer':   ['software engineer', 'разработчик', 'программист'],
  'software engineer':    ['software developer', 'разработчик', 'инженер'],
  'engineer':             ['инженер', 'developer', 'разработчик'],
  'инженер':              ['engineer', 'developer', 'разработчик'],
  'programmer':           ['программист', 'developer', 'разработчик'],
  'программист':          ['programmer', 'developer', 'разработчик'],

  'frontend':             ['frontend developer', 'фронтенд', 'верстальщик'],
  'frontend developer':   ['фронтенд разработчик', 'верстальщик', 'UI developer'],
  'backend':              ['backend developer', 'бэкенд'],
  'backend developer':    ['бэкенд разработчик', 'серверный разработчик'],
  'fullstack':            ['fullstack developer', 'фулстек'],
  'fullstack developer':  ['фулстек разработчик', 'frontend developer', 'backend developer'],
  'mobile developer':     ['iOS developer', 'android developer', 'мобильный разработчик'],
  'ios developer':        ['mobile developer', 'android developer', 'swift'],
  'android developer':    ['mobile developer', 'iOS developer', 'kotlin'],

  'lead':                 ['team lead', 'тимлид', 'tech lead'],
  'team lead':            ['тимлид', 'tech lead', 'engineering manager'],
  'тимлид':               ['team lead', 'tech lead', 'lead'],
  'tech lead':            ['техлид', 'team lead', 'architect'],
  'техлид':               ['tech lead', 'тимлид', 'архитектор'],
  'architect':            ['архитектор', 'solution architect', 'tech lead'],
  'архитектор':           ['architect', 'solution architect', 'техлид'],
  'solution architect':   ['architect', 'архитектор', 'tech lead'],

  'manager':              ['менеджер', 'project manager', 'product manager'],
  'менеджер':             ['manager', 'менеджер проекта', 'продуктовый менеджер'],
  'project manager':      ['менеджер проекта', 'product manager', 'scrum master'],
  'менеджер проекта':     ['project manager', 'product manager', 'scrum master'],
  'product manager':      ['продуктовый менеджер', 'product owner', 'project manager'],
  'продуктовый менеджер': ['product manager', 'product owner', 'менеджер проекта'],
  'product owner':        ['product manager', 'продуктовый менеджер', 'scrum master'],
  'scrum master':         ['product owner', 'project manager', 'agile coach'],
  'engineering manager':  ['team lead', 'тимлид', 'head of engineering'],

  'analyst':              ['аналитик', 'business analyst', 'data analyst'],
  'аналитик':             ['analyst', 'бизнес-аналитик', 'системный аналитик'],
  'business analyst':     ['бизнес-аналитик', 'system analyst', 'product manager'],
  'бизнес-аналитик':      ['business analyst', 'системный аналитик', 'аналитик'],
  'system analyst':       ['системный аналитик', 'business analyst', 'architect'],
  'системный аналитик':   ['system analyst', 'бизнес-аналитик', 'аналитик'],
  'data analyst':         ['data scientist', 'data engineer', 'аналитик данных'],
  'data scientist':       ['data analyst', 'ML engineer', 'data engineer'],
  'data engineer':        ['data scientist', 'data analyst', 'дата-инженер'],
  'ml engineer':          ['data scientist', 'AI engineer', 'ML инженер'],
  'ai engineer':          ['ML engineer', 'data scientist'],

  'qa':                   ['тестировщик', 'QA engineer', 'QA инженер'],
  'тестировщик':          ['QA', 'QA engineer', 'test engineer'],
  'qa engineer':          ['QA инженер', 'тестировщик', 'SDET'],
  'qa инженер':           ['QA engineer', 'тестировщик', 'test engineer'],
  'test engineer':        ['QA engineer', 'SDET', 'тестировщик'],
  'sdet':                 ['QA engineer', 'test engineer', 'автотестировщик'],

  'devops':               ['девопс', 'devops engineer', 'SRE'],
  'девопс':               ['devops', 'devops engineer', 'SRE'],
  'devops engineer':      ['девопс инженер', 'SRE', 'cloud engineer'],
  'sre':                  ['site reliability engineer', 'devops', 'platform engineer'],

  'cto':                  ['VP Engineering', 'technical director', 'технический директор'],
  'технический директор': ['CTO', 'technical director', 'VP Engineering'],
  'head of engineering':  ['engineering manager', 'CTO', 'VP Engineering'],

  'recruiter':            ['рекрутер', 'sourcer', 'HR'],
  'рекрутер':             ['recruiter', 'sourcer', 'HR менеджер'],
  'sourcer':              ['recruiter', 'рекрутер', 'IT recruiter'],
  'hr':                   ['HR менеджер', 'recruiter', 'рекрутер'],

  // ── Job Titles: Design ──
  'designer':             ['дизайнер', 'UI designer', 'UX designer', 'product designer'],
  'дизайнер':             ['designer', 'UI дизайнер', 'UX дизайнер', 'графический дизайнер'],
  'ui designer':          ['UI дизайнер', 'UX designer', 'product designer', 'web designer'],
  'ui дизайнер':          ['UI designer', 'UX дизайнер', 'веб-дизайнер', 'продуктовый дизайнер'],
  'ux designer':          ['UX дизайнер', 'UI designer', 'UX researcher', 'product designer'],
  'ux дизайнер':          ['UX designer', 'UI дизайнер', 'UX исследователь', 'продуктовый дизайнер'],
  'ui/ux designer':       ['UI/UX дизайнер', 'product designer', 'web designer'],
  'ui/ux дизайнер':       ['UI/UX designer', 'продуктовый дизайнер', 'веб-дизайнер'],
  'product designer':     ['продуктовый дизайнер', 'UI designer', 'UX designer'],
  'продуктовый дизайнер': ['product designer', 'UI дизайнер', 'UX дизайнер'],
  'ux researcher':        ['UX исследователь', 'UX designer', 'product designer'],
  'graphic designer':     ['графический дизайнер', 'brand designer', 'illustrator'],
  'графический дизайнер': ['graphic designer', 'бренд-дизайнер', 'иллюстратор'],
  'web designer':         ['веб-дизайнер', 'UI designer', 'frontend developer'],
  'веб-дизайнер':         ['web designer', 'UI дизайнер', 'верстальщик'],
  'motion designer':      ['моушн дизайнер', 'animator', 'VFX artist', '3D designer'],
  'моушн дизайнер':       ['motion designer', 'аниматор', '3D дизайнер', 'VFX artist'],
  '3d designer':          ['3D дизайнер', '3D artist', 'motion designer', '3D modeler'],
  '3d дизайнер':          ['3D designer', '3D artist', 'моушн дизайнер', '3D художник'],
  '3d artist':            ['3D художник', '3D designer', '3D modeler', 'concept artist'],
  '3d художник':          ['3D artist', '3D дизайнер', 'concept artist'],
  'art director':         ['арт-директор', 'creative director', 'lead designer'],
  'арт-директор':         ['art director', 'креативный директор', 'дизайнер'],
  'creative director':    ['креативный директор', 'art director', 'brand designer'],
  'креативный директор':  ['creative director', 'арт-директор', 'бренд-дизайнер'],
  'brand designer':       ['бренд-дизайнер', 'graphic designer', 'art director'],
  'бренд-дизайнер':       ['brand designer', 'графический дизайнер', 'арт-директор'],
  'illustrator':          ['иллюстратор', 'graphic designer', 'concept artist'],
  'иллюстратор':          ['illustrator', 'графический дизайнер', 'concept artist'],
  'animator':             ['аниматор', 'motion designer', 'VFX artist'],
  'аниматор':             ['animator', 'моушн дизайнер', 'VFX artist'],
  'vfx artist':           ['motion designer', 'animator', '3D artist', 'compositing'],
  'concept artist':       ['illustrator', '3D artist', 'art director'],
  'game designer':        ['геймдизайнер', 'level designer', 'game developer'],
  'геймдизайнер':         ['game designer', 'level designer', 'game developer'],

  // ── Skills: Design — UI/UX ──
  'figma':             ['sketch', 'adobe xd', 'protopie', 'framer', 'zeplin', 'storybook'],
  'sketch':            ['figma', 'adobe xd', 'invision', 'zeplin', 'abstract'],
  'adobe xd':          ['figma', 'sketch', 'protopie', 'invision'],
  'design systems':    ['figma', 'storybook', 'tokens', 'UI kit'],
  'prototyping':       ['figma', 'protopie', 'principle', 'framer'],
  'framer':            ['figma', 'protopie', 'principle', 'react'],
  'zeplin':            ['figma', 'sketch', 'design handoff'],
  'invision':          ['figma', 'sketch', 'zeplin', 'marvel'],
  'miro':              ['figjam', 'notion', 'figma'],
  'protopie':          ['figma', 'principle', 'framer', 'rive'],

  // ── Skills: Design — Graphic ──
  'adobe photoshop':   ['adobe illustrator', 'adobe lightroom', 'affinity photo', 'figma'],
  'adobe illustrator': ['adobe photoshop', 'adobe indesign', 'affinity designer', 'coreldraw'],
  'adobe indesign':    ['adobe illustrator', 'adobe photoshop', 'typography'],
  'canva':             ['adobe photoshop', 'figma', 'adobe illustrator'],
  'procreate':         ['adobe illustrator', 'adobe photoshop', 'illustration'],

  // ── Skills: Design — 3D ──
  'blender':              ['cinema 4d', 'autodesk maya', '3ds max', 'substance painter', 'zbrush'],
  'cinema 4d':            ['blender', 'octane render', 'redshift', 'after effects', 'houdini'],
  'autodesk maya':        ['blender', '3ds max', 'zbrush', 'substance painter', 'arnold'],
  '3ds max':              ['autodesk maya', 'blender', 'v-ray', 'corona renderer'],
  'zbrush':               ['blender', 'autodesk maya', 'substance painter', 'mudbox'],
  'substance painter':    ['substance designer', 'blender', 'zbrush', 'autodesk maya'],
  'houdini':              ['cinema 4d', 'blender', 'unreal engine', 'nuke'],
  'unreal engine':        ['unity', 'blender', 'c++', 'houdini'],
  'unity':                ['unreal engine', 'blender', 'c#', 'cinema 4d'],
  'v-ray':                ['corona renderer', '3ds max', 'autodesk maya', 'sketchup'],
  'keyshot':              ['solidworks', 'rhino 3d', 'fusion 360'],
  'rhino 3d':             ['grasshopper', 'keyshot', 'v-ray', 'fusion 360'],
  'sketchup':             ['v-ray', 'lumion', 'autocad', 'revit'],

  // ── Skills: Design — Motion ──
  'after effects':    ['premiere pro', 'cinema 4d', 'lottie', 'mocha pro', 'element 3d'],
  'premiere pro':     ['after effects', 'davinci resolve', 'media encoder'],
  'davinci resolve':  ['premiere pro', 'after effects', 'color grading'],
  'lottie':           ['after effects', 'rive', 'bodymovin', 'figma'],
  'rive':             ['lottie', 'framer motion', 'gsap', 'figma'],
  'gsap':             ['framer motion', 'css animations', 'three.js', 'lottie'],
  'spine':            ['after effects', 'unity', 'animation'],

  // ── Skills: Design — Web/Nocode ──
  'webflow':    ['figma', 'framer', 'wordpress', 'html', 'css'],
  'wordpress':  ['elementor', 'webflow', 'php', 'html', 'css'],
  'tilda':      ['figma', 'webflow', 'readymag'],
  'readymag':   ['tilda', 'figma', 'webflow'],

  // ── Skills: Dev — Frontend ──
  'react':        ['typescript', 'next.js', 'redux', 'tailwind css', 'storybook'],
  'vue':          ['typescript', 'nuxt', 'pinia', 'tailwind css'],
  'angular':      ['typescript', 'rxjs', 'ngrx'],
  'svelte':       ['typescript', 'sveltekit', 'tailwind css'],
  'next.js':      ['react', 'typescript', 'vercel', 'tailwind css'],
  'tailwind css': ['react', 'vue', 'css', 'figma'],
  'three.js':     ['webgl', 'react three fiber', 'blender', 'gsap'],

  // ── Skills: Dev — Backend ──
  'python':  ['django', 'fastapi', 'flask', 'postgresql', 'docker'],
  'golang':  ['kubernetes', 'docker', 'grpc', 'postgresql', 'redis'],
  'go':      ['kubernetes', 'docker', 'grpc', 'postgresql', 'redis'],
  'java':    ['spring', 'kotlin', 'postgresql', 'kafka', 'docker'],
  'node.js': ['typescript', 'express', 'nestjs', 'postgresql', 'mongodb'],
  'rust':    ['webassembly', 'tokio', 'linux', 'c++'],
  'c++':     ['unreal engine', 'qt', 'linux', 'embedded'],
  'c#':      ['.net', 'unity', 'azure', 'blazor'],
  '.net':    ['c#', 'azure', 'sql server', 'docker'],
  'php':     ['laravel', 'wordpress', 'mysql', 'docker'],
  'ruby':    ['rails', 'postgresql', 'redis', 'docker'],

  // ── Skills: Dev — Infra ──
  'kubernetes': ['docker', 'helm', 'terraform', 'aws', 'prometheus'],
  'docker':     ['kubernetes', 'docker compose', 'ci/cd', 'linux'],
  'terraform':  ['aws', 'gcp', 'azure', 'ansible', 'kubernetes'],
  'aws':        ['terraform', 'docker', 'kubernetes', 'lambda', 's3'],
};

export function getRelatedSuggestions(tags: string[]): string[] {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const key = tag.toLowerCase();
    const matches = related[key] ?? [];
    for (const r of matches) {
      const rLower = r.toLowerCase();
      if (!tagSet.has(rLower) && !seen.has(rLower)) {
        seen.add(rLower);
        result.push(r);
      }
    }
  }

  return result.slice(0, 5);
}

// ── Related для Exclude (грейды) ──
const excludeRelated: Record<string, string[]> = {
  'intern':     ['trainee', 'стажёр', 'junior'],
  'trainee':    ['intern', 'стажёр', 'junior'],
  'стажёр':     ['intern', 'trainee', 'джуниор'],
  'junior':     ['junior+', 'джуниор', 'intern', 'trainee'],
  'junior+':    ['junior', 'middle', 'джуниор'],
  'джуниор':    ['junior', 'junior+', 'стажёр'],
  'middle':     ['middle+', 'мидл', 'senior'],
  'middle+':    ['middle', 'senior', 'мидл'],
  'мидл':       ['middle', 'middle+', 'сеньор'],
  'senior':     ['senior+', 'сеньор', 'staff', 'lead'],
  'senior+':    ['senior', 'staff', 'principal'],
  'сеньор':     ['senior', 'senior+', 'lead'],
  'staff':      ['principal', 'senior+', 'tech lead'],
  'principal':  ['staff', 'senior+', 'architect'],
  'lead':       ['team lead', 'tech lead', 'тимлид', 'техлид', 'head'],
  'team lead':  ['тимлид', 'tech lead', 'lead', 'manager'],
  'тимлид':     ['team lead', 'tech lead', 'техлид', 'lead'],
  'tech lead':  ['техлид', 'team lead', 'lead', 'architect'],
  'техлид':     ['tech lead', 'team lead', 'тимлид', 'lead'],
  'head':       ['director', 'VP', 'manager'],
  'manager':    ['head', 'director', 'team lead'],
  'director':   ['VP', 'head', 'CTO'],
  'vp':         ['director', 'CTO', 'CEO'],
  'cto':        ['VP', 'CEO', 'director'],
  'ceo':        ['CTO', 'VP', 'director'],
  'recruiter':  ['HR', 'sales'],
  'hr':         ['recruiter', 'manager'],
  'sales':      ['recruiter', 'consultant'],
  'freelance':  ['consultant'],
  'consultant': ['freelance'],
};

export function getExcludeRelated(tags: string[]): string[] {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const key = tag.toLowerCase();
    const matches = excludeRelated[key] ?? [];
    for (const r of matches) {
      const rLower = r.toLowerCase();
      if (!tagSet.has(rLower) && !seen.has(rLower)) {
        seen.add(rLower);
        result.push(r);
      }
    }
  }

  return result.slice(0, 5);
}
