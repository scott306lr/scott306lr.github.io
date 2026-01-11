import path from 'node:path';
import fs from 'node:fs/promises';

export async function resolveEntrySourcePath(params: {
  cwdPathname: string;
  collection: 'posts' | 'works';
  slug: string;
}): Promise<string | null> {
  const base = path.join(params.cwdPathname, 'src', 'content', params.collection);
  const candidates = [`${params.slug}.mdx`, `${params.slug}.md`].map((f) => path.join(base, f));

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  return null;
}
