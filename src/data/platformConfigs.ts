export type Platform =
  | 'linkedin' | 'habr' | 'habr_users'
  | 'behance' | 'dribbble' | 'github' | 'stackoverflow'
  | 'facebook' | 'instagram' | 'tenchat' | 'setka'
  | 'codepen' | 'kaggle' | 'threads' | 'arena'
  | 'webflow' | 'dprofile' | 'designer_ru' | 'taplink';

export type LayoutType = 'linkedin' | 'habr' | 'generic';

export interface PlatformConfig {
  key: Platform;
  label: string;
  accent: string;       // hex-цвет для dot и trigger
  layout: LayoutType;
  site: string;         // значение после site: (пусто только для linkedin)
  fixedTerms: string[]; // добавляются в запрос как есть, после пользовательских полей
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    key: 'linkedin', label: 'LinkedIn', accent: '#4a9eff',
    layout: 'linkedin', site: '', fixedTerms: [],
  },
  {
    key: 'habr', label: 'Habr Career', accent: '#48bb78',
    layout: 'habr', site: 'career.habr.com', fixedTerms: [],
  },
  {
    key: 'habr_users', label: 'Habr Users', accent: '#ed8936',
    layout: 'generic', site: 'habr.com/ru/users/', fixedTerms: ['"Состоит в хабах"'],
  },
  {
    key: 'behance', label: 'Behance', accent: '#9f7aea',
    layout: 'generic', site: 'behance.net', fixedTerms: [],
  },
  {
    key: 'dribbble', label: 'Dribbble', accent: '#e53e8c',
    layout: 'generic', site: 'dribbble.com', fixedTerms: ['"member since"'],
  },
  {
    key: 'github', label: 'GitHub', accent: '#a0aec0',
    layout: 'generic', site: 'github.com', fixedTerms: ['"block or report"'],
  },
  {
    key: 'stackoverflow', label: 'StackOverflow', accent: '#f6861f',
    layout: 'generic', site: 'ru.stackoverflow.com/users', fixedTerms: [],
  },
  {
    key: 'facebook', label: 'Facebook', accent: '#4a9eff',
    layout: 'generic', site: 'facebook.com', fixedTerms: ['inurl:people'],
  },
  {
    key: 'instagram', label: 'Instagram', accent: '#e040fb',
    layout: 'generic', site: 'instagram.com', fixedTerms: [],
  },
  {
    key: 'tenchat', label: 'TenChat', accent: '#38b2ac',
    layout: 'generic', site: 'tenchat.ru',
    fixedTerms: ['"расширяю деловые связи" OR "ищу новые заказы" -inurl:media'],
  },
  {
    key: 'setka', label: 'Setka', accent: '#00b5d8',
    layout: 'generic', site: 'setka.ru/users', fixedTerms: [],
  },
  {
    key: 'codepen', label: 'CodePen', accent: '#47cf73',
    layout: 'generic', site: 'codepen.io',
    fixedTerms: ['intitle:"on codepen" -inurl:following|followers|projects|pens|tag'],
  },
  {
    key: 'kaggle', label: 'Kaggle', accent: '#20beff',
    layout: 'generic', site: 'kaggle.com', fixedTerms: ['"last seen*"'],
  },
  {
    key: 'threads', label: 'Threads', accent: '#cbd5e0',
    layout: 'generic', site: 'threads.net', fixedTerms: [],
  },
  {
    key: 'arena', label: 'Are.na', accent: '#90cdf4',
    layout: 'generic', site: 'are.na',
    fixedTerms: ['"Joined" instagram|behance|dribbble|dprofile'],
  },
  {
    key: 'webflow', label: 'Webflow', accent: '#4353ff',
    layout: 'generic', site: '*.webflow.io', fixedTerms: ['-inurl:mentors'],
  },
  {
    key: 'dprofile', label: 'Dprofile', accent: '#f6ad55',
    layout: 'generic', site: 'dprofile.ru/*', fixedTerms: [],
  },
  {
    key: 'designer_ru', label: 'Designer.ru', accent: '#fc8181',
    layout: 'generic', site: 'designer.ru', fixedTerms: ['intitle:портфолио'],
  },
  {
    key: 'taplink', label: 'Taplink', accent: '#68d391',
    layout: 'generic', site: 'taplink.cc', fixedTerms: [],
  },
];

export function getPlatformConfig(key: Platform): PlatformConfig {
  return PLATFORM_CONFIGS.find(p => p.key === key)!;
}
