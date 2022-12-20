import pluginReact from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { resolveConfig } from './config';
import { PACKAGE_ROOT } from './constants';
import { pluginConfig } from './plugin-island/config';
import { pluginIndexHtml } from './plugin-island/indexHtml';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  // 异步的过程
  const config = await resolveConfig(root, 'serve', 'development');

  return createServer({
    // 绕开 vite 接管文件服务
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
