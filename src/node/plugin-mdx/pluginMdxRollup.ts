import pluginMdx from '@mdx-js/rollup';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
import remarkPluginFrontmatter from 'remark-frontmatter';
import remarkGFM from 'remark-gfm';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import { Plugin } from 'vite';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      // 自动转化
      remarkGFM,
      remarkPluginFrontmatter,
      [
        remarkPluginMDXFrontMatter,
        {
          name: 'frontmatter'
        }
      ]
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  }) as unknown as Plugin;
}
