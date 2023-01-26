import { normalizePath } from 'vite';
import fastGlob from 'fast-glob';
import path from 'path';
import { pathToFileURL } from 'url';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      })
      .sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );

      // 构造路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);

      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  normalizeRoutePath(raw: string) {
    const routePath = raw.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  generateRoutesCode(ssr: boolean) {
    return `
    import React from 'react';
    ${ssr ? '' : 'import loadable from "@loadable/component";'}
    ${this.#routeData
      .map((route, index) => {
        // return `import Route${index} from '${route.absolutePath}'`;
        // 按需加载

        return ssr
          ? `import Route${index} from "${route.absolutePath}";`
          : `const Route${index} =  loadable(() => import('${route.absolutePath}'));`;
      })
      .join('\n')}
    export const routes = [
        ${this.#routeData
          .map((route, index) => {
            return `{path:'${route.routePath}',element:React.createElement(Route${index}),preload:()=> import('${route.absolutePath}')}`;
          })
          .join(',\n')}
    ]
    
    `;
  }
}
