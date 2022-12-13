import path = require('path')
import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import * as fs from 'fs-extra'
import { join } from 'path'
import pluginReact from '@vitejs/plugin-react'

export async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root, // 注意加上这个插件，自动注入 import React from 'react'，避免 React is not defined 的错误
        plugins: [pluginReact()],
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
      }
    }

    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false))
    }

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true))
    }
    console.log('Building client + server bundles...')
    // 性能优化
    // 使用Promise.all来执行构建构成，并发执行，避免阻塞
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
    // await clientBuild()
    // await serverBuild()
  } catch (e) {
    console.log(e)
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render()

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
  </html>`.trim()
  await fs.ensureDir(join(root, 'build'))
  await fs.writeFile(join(root, 'build/index.html'), html)
  await fs.remove(join(root, '.temp'))
}

export async function build(root: string) {
  // bundle - client端 + server端
  const [clientBundle, serverBundle] = await bundle(root)
  debugger
  // 引入server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  // 服务端渲染 产出HTML

  const { render } = require(serverEntryPath)

  await renderPage(render, root, clientBundle)
}
