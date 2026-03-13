import type { FormState } from '../types';
import type { Platform } from '../data/platformConfigs';
import { getPlatformConfig } from '../data/platformConfigs';

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

function contactTerms(platforms: Record<string, boolean>): string[] {
  return Object.entries(platforms)
    .filter(([, on]) => on)
    .map(([key]) => PLATFORM_QUERIES[key])
    .filter(Boolean);
}

/** Общий построитель для всех платформ кроме LinkedIn */
function buildGenericQuery(fields: FormState, site: string, fixedTerms: string[]): string {
  const parts: string[] = [];

  parts.push(`site:${site}`);

  if (fields.jobTitles.length)
    parts.push(fields.jobTitles.map(quote).join(' OR '));

  if (fields.habrGrades.length)
    parts.push(fields.habrGrades.map(g => g.toLowerCase()).join(' OR '));

  if (fields.skillsAnd.length)
    parts.push(fields.skillsAnd.map(quote).join(' '));

  if (fields.skillsOr.length)
    parts.push(fields.skillsOr.map(quote).join(' OR '));

  if (fields.locations.length)
    parts.push(fields.locations.map(l => `"${low(l)}"`).join(' OR '));

  if (fields.companies.length)
    parts.push(fields.companies.map(quote).join(' OR '));

  const ct = contactTerms(fields.platforms);
  if (ct.length) parts.push(ct.join(' OR '));

  for (const term of fixedTerms)
    parts.push(term);

  if (fields.exclude.length)
    parts.push(fields.exclude.map(e => {
      const v = low(e);
      return needsQuotes(v) ? `-"${v}"` : `-${v}`;
    }).join(' '));

  return parts.join(' ');
}

export function buildQuery(fields: FormState, platform: Platform): string {
  const config = getPlatformConfig(platform);

  // ── Habr Career — особый статус ──
  if (platform === 'habr') {
    const statusTerms: string[] = [];
    if (fields.habrStatus === 'about')
      statusTerms.push('"обо мне"');
    else if (fields.habrStatus === 'seeking')
      statusTerms.push('"Ищу работу" OR "Рассмотрю предложения" -"Не ищу работу" -intitle:специалисты');
    return buildGenericQuery(fields, config.site, statusTerms);
  }

  // ── LinkedIn — intitle + регион ──
  if (platform === 'linkedin') {
    const parts: string[] = [];
    parts.push(`site:${fields.region}.linkedin.com/in`);

    if (fields.jobTitles.length)
      parts.push(fields.jobTitles.map(intitle).join(' OR '));

    if (fields.skillsAnd.length)
      parts.push(fields.skillsAnd.map(quote).join(' '));

    if (fields.skillsOr.length)
      parts.push(fields.skillsOr.map(quote).join(' OR '));

    if (fields.locations.length)
      parts.push(fields.locations.map(l => `"${low(l)}"`).join(' OR '));

    if (fields.companies.length)
      parts.push(fields.companies.map(intitle).join(' OR '));

    const ct = contactTerms(fields.platforms);
    if (ct.length) parts.push(ct.join(' OR '));

    if (fields.exclude.length)
      parts.push(fields.exclude.map(e => {
        const v = low(e);
        return needsQuotes(v) ? `-intitle:"${v}"` : `-intitle:${v}`;
      }).join(' '));

    return parts.join(' ');
  }

  // ── Все остальные платформы ──
  return buildGenericQuery(fields, config.site, config.fixedTerms);
}
