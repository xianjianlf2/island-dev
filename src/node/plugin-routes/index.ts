import { Plugin } from 'vite';
import { RouteService } from './RouteService';
import React from 'react';
import { PageModule } from 'shared/types';
export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageModule>;
}

interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export const CONVENTIONAL_ROUTE_ID = 'island:routes';

export function pluginRoutes(options: PluginOptions): Plugin {
  const routerService = new RouteService(options.root);
  return {
    name: 'island:routes',
    async configResolved() {
      await routerService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    load(id) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routerService.generateRoutesCode(options.isSSR);
      }
    }
  };
}
