import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants/index'
import { Plugin } from 'vite'
import { readFile } from 'fs/promises'

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    // 自动注入
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',

            attrs: {
              type: 'module',
              // 绝对路径使用前缀   vite规定
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      }
    },

    configureServer(server) {
      // 注册完放到 return 中，最后执行
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取 template.html 的内容
          // 响应html浏览器
          let content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8')

          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          )

          res.setHeader('Content-Type', 'text/html')

          res.end(content)
        })
      }
    }
  }
}
