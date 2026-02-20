const API_URL = 'https://api.stackexchange.com/2.3/tags';

let cache = new Map<string, string[]>();

export async function fetchSkillSuggestions(query: string): Promise<string[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  if (cache.has(q)) return cache.get(q)!;

  try {
    const params = new URLSearchParams({
      order: 'desc',
      sort: 'popular',
      inname: q,
      site: 'stackoverflow',
      pagesize: '10',
    });

    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) return [];

    const data = await res.json();
    const names: string[] = (data.items ?? []).map((t: { name: string }) => t.name);

    cache.set(q, names);
    return names;
  } catch {
    return [];
  }
}
