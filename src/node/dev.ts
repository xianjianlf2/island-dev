import pluginReact from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import { resolveConfig } from './config';

export async function createDevServer(root: string) {
  // 异步的过程
  const config = await resolveConfig(root, 'serve', 'development');

  console.log(config);
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
