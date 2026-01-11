import type { CollectionEntry } from 'astro:content';

export function isNotDraft(entry: CollectionEntry<'posts'> | CollectionEntry<'projects'>): boolean {
  return !entry.data.draft;
}

export function sortByDateDesc<T extends { data: { pubDate?: Date; date?: Date } }>(
  a: T,
  b: T,
): number {
  const aDate = a.data.pubDate ?? a.data.date ?? new Date(0);
  const bDate = b.data.pubDate ?? b.data.date ?? new Date(0);
  return bDate.getTime() - aDate.getTime();
}
