import { relative } from 'path';
import { SiteConfig } from 'shared/types/index';
import { Plugin, normalizePath } from 'vite';

// 虚拟模块
const SITE_DATA_ID = 'island:site-data';

export function pluginConfig(
  config: SiteConfig,
  restartServer: () => Promise<void>
): Plugin {
  // let server: ViteDevServer | null = null;
  return {
    name: 'island:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    // configureServer(s) {
    //   server = s;
    // },]
    async handleHotUpdate(ctx) {
      // bugfix: windows环境下，路径不一致

      const customWatchedFiles = [normalizePath(config.configPath)];
      // const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));

      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        // 重启 Dev Server

        // 2.手动调用 dev.ts 中的 createServer
        await restartServer();
      }
      // 方案探讨
      // 重启server

      // 1.插件内置重启vite中的 dev server
      // 不起作用，没有进行Island框架配置的重新读取
      // await server.restart();
    }
  };
}
