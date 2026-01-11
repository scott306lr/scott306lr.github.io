import { getCollection, type CollectionEntry } from 'astro:content';
import { isNotDraft, sortByDateDesc } from './content';
import { slugifyTag } from './tags';

export type TaggedEntry =
  | ({ kind: 'post' } & CollectionEntry<'posts'>)
  | ({ kind: 'project' } & CollectionEntry<'projects'>);

export type TagIndexItem = {
  slug: string;
  label: string;
  count: number;
};

export async function getAllTaggedEntries(): Promise<TaggedEntry[]> {
  const posts = (await getCollection('posts'))
    .filter(isNotDraft)
    .map((p) => ({ ...p, kind: 'post' as const }));
  const projects = (await getCollection('projects'))
    .filter(isNotDraft)
    .map((p) => ({ ...p, kind: 'project' as const }));
  return [...posts, ...projects].sort(sortByDateDesc);
}

export async function getTagIndex(): Promise<TagIndexItem[]> {
  const entries = await getAllTaggedEntries();
  const map = new Map<string, { label: string; count: number }>();

  for (const entry of entries) {
    const tags = entry.data.tags ?? [];
    for (const tag of tags) {
      const slug = slugifyTag(tag);
      if (!slug) continue;
      const current = map.get(slug);
      if (current) {
        current.count += 1;
      } else {
        map.set(slug, { label: tag, count: 1 });
      }
    }
  }

  return [...map.entries()]
    .map(([slug, v]) => ({ slug, label: v.label, count: v.count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function getEntriesForTag(
  slug: string,
): Promise<{ posts: TaggedEntry[]; projects: TaggedEntry[] }> {
  const entries = await getAllTaggedEntries();
  const matching = entries.filter((e) => (e.data.tags ?? []).some((t) => slugifyTag(t) === slug));
  return {
    posts: matching.filter((e) => e.kind === 'post'),
    projects: matching.filter((e) => e.kind === 'project'),
  };
}
