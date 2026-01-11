import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isNotDraft, sortByDateDesc } from '../lib/content';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts')).filter(isNotDraft).sort(sortByDateDesc);

  return rss({
    title: 'Scott — Posts',
    description: 'Thoughts and write-ups by Scott.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.slug}/`,
    })),
  });
}
