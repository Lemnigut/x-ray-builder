import type { FormState } from '../types';

export const PLATFORMS: { key: string; label: string }[] = [
  { key: 'telegram', label: 'Telegram' },
  { key: 'dribbble', label: 'Dribbble' },
  { key: 'behance',  label: 'Behance' },
  { key: 'github',   label: 'GitHub' },
  { key: 'gmail',    label: '@gmail.com' },
  { key: 'mailru',   label: '@mail.ru' },
  { key: 'yandex',   label: '@yandex.ru' },
];

const PLATFORM_QUERIES: Record<string, string> = {
  telegram: '"t.me"',
  dribbble: '"dribbble.com"',
  behance:  '"behance.net"',
  github:   '"github.com"',
  gmail:    '"@gmail.com"',
  mailru:   '"@mail.ru"',
  yandex:   '"@yandex.ru"',
};

/** Нужны кавычки: несколько слов, цифры, точки, дефисы, +, #, и т.д. */
function needsQuotes(value: string): boolean {
  return /\s|[0-9.+#\-/]/.test(value);
}

function low(value: string): string {
  return value.toLowerCase();
}

function quote(value: string): string {
  const v = low(value);
  return needsQuotes(v) ? `"${v}"` : v;
}

function intitle(value: string): string {
  const v = low(value);
  return needsQuotes(v) ? `intitle:"${v}"` : `intitle:${v}`;
}

export function buildQuery(fields: FormState): string {
  const parts: string[] = [];

  // site:
  parts.push(`site:${fields.region}.linkedin.com/in`);

  // job titles: intitle:X OR intitle:Y
  if (fields.jobTitles.length)
    parts.push(fields.jobTitles.map(intitle).join(' OR '));

  // skills AND: все должны присутствовать (неявный AND через пробел)
  if (fields.skillsAnd.length)
    parts.push(fields.skillsAnd.map(quote).join(' '));

  // skills OR: любой из
  if (fields.skillsOr.length)
    parts.push(fields.skillsOr.map(quote).join(' OR '));

  // location: всегда в кавычках (города)
  if (fields.locations.length)
    parts.push(fields.locations.map(l => `"${low(l)}"`).join(' OR '));

  // company: intitle:X OR intitle:Y
  if (fields.companies.length)
    parts.push(fields.companies.map(intitle).join(' OR '));

  // platforms: чекбоксы — добавляют поисковые строки
  const platformTerms = Object.entries(fields.platforms)
    .filter(([, on]) => on)
    .map(([key]) => PLATFORM_QUERIES[key])
    .filter(Boolean);
  if (platformTerms.length)
    parts.push(platformTerms.join(' OR '));

  // exclude: -intitle:X -intitle:Y (убираем из заголовка)
  if (fields.exclude.length)
    parts.push(fields.exclude.map(e => {
      const v = low(e);
      return needsQuotes(v) ? `-intitle:"${v}"` : `-intitle:${v}`;
    }).join(' '));

  return parts.join(' ');
}
