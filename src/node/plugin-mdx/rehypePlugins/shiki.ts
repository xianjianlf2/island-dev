import { visit } from 'unist-util-visit';

import type { Plugin } from 'unified';
import type { Text, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import shiki from 'shiki';

interface Options {
  highlighter: shiki.Highlighter;
}

export const rehypePluginShiki: Plugin<[Options], Root> = ({ highlighter }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0]?.tagName === 'code'
      ) {
        // 需要传递的参数：
        // 语法名称
        // 代码内容
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // language-js
        const lang = codeClassName.split('-')[1];
        if (!lang) {
          return;
        }

        const highlightedCode = highlighter.codeToHtml(codeContent, { lang });

        // 转成AST 插入字符串
        const fragmentAst = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};
