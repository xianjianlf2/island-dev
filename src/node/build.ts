import fs from 'fs-extra';
import ora from 'ora';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import { SiteConfig } from 'shared/types';
import { pathToFileURL } from 'url';
import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { createVitePlugins } from './vitePlugins';

// const dynamicImport = new Function('m', 'return import(m)');

export async function bundle(root: string, config: SiteConfig) {
  try {
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root, // 注意加上这个插件，自动注入 import React from 'react'，避免 React is not defined 的错误
        plugins: await createVitePlugins(config),
        // 解决react dom 中esm cjs不兼容的问题
        ssr: {
          noExternal: ['react-router-dom']
        },
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };

    const clientBuild = async () => {
      return viteBuild(await resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
    };
    // const spinner = ora()
    // tsc 编译一直是required
    // require 是同步加载，会导致出错
    // const { default: ora } = await import('ora')
    // 更换编译工具  tsup
    // const { default: ora } = await dynamicImport('ora')
    const spinner = ora();
    spinner.start('Building client + server bundles...');
    // console.log('Building client + server bundles...')
    // 性能优化
    // 使用Promise.all来执行构建构成，并发执行，避免阻塞
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spinner.stop();
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
    // await clientBuild()
    // await serverBuild()
  } catch (e) {
    console.log(e);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
    </body>
  </html>`.trim();
  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
}

export async function build(root: string, config: SiteConfig) {
  // bundle - client端 + server端
  // config 透传给bundle 实现打包配置
  const [clientBundle, serverBundle] = await bundle(root, config);
  // 引入server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  // 服务端渲染 产出HTML

  // const { render } = require(serverEntryPath)
  // 兼容 windows
  // const { render } = await import(serverEntryPath)
  const { render } = await import(pathToFileURL(serverEntryPath).toString());

  await renderPage(render, root, clientBundle);
}
