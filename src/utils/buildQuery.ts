import type { FormState } from '../types';

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

  // contacts: "@ gmail.com" OR "telegram" (поиск контактов в тексте)
  if (fields.contacts.length)
    parts.push(fields.contacts.map(c => `"${low(c)}"`).join(' OR '));

  // exclude: -intitle:X -intitle:Y (убираем из заголовка)
  if (fields.exclude.length)
    parts.push(fields.exclude.map(e => {
      const v = low(e);
      return needsQuotes(v) ? `-intitle:"${v}"` : `-intitle:${v}`;
    }).join(' '));

  return parts.join(' ');
}
