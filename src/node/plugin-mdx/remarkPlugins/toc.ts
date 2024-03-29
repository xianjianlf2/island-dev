import type { Plugin } from 'unified';
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
import type { MdxjsEsm, Program } from 'mdast-util-mdxjs-esm';
import { parse } from 'acorn';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode';
  value?: string;
  children?: ChildNode[];
}

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    // 每次编译时都重新进行实例的初始化
    const slugger = new Slugger();
    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children?.length) {
        return;
      }
      //   h2~h4 标题节点
      if (node.depth > 1 && node.depth < 5) {
        const originalText = (node.children as ChildNode[])
          //bugfix: toc中link不能生成链接
          .map((child) => {
            switch (child.type) {
              case 'link':
                return child.children?.map((c) => c.value).join('');
              default:
                return child.value;
            }
          })
          .join('');
        const id = slugger.slug(originalText);

        toc.push({
          id,
          text: originalText,
          depth: node.depth
        });
      }
    });

    // 构造 export const toc = []
    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;

    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    } as MdxjsEsm);
  };
};
