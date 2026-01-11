// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
import mdx from '@astrojs/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.scottwps.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    mdx({
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: { light: 'github-light', dark: 'github-dark' },
            keepBackground: false,
          },
        ],
      ],
    }),
    sitemap(),
  ],
});
