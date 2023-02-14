import { routes } from 'island:routes';
import siteData from 'island:site-data';
import { Route } from 'node/plugin-routes';
import { matchRoutes } from 'react-router-dom';
import { PageData } from 'shared/types';
import { Layout } from '../theme-default';

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const route = matched[0].route as Route;
    // 获取组件编译后的模块内容
    const moduleInfo = await route.preload();
    console.log(moduleInfo);
    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath
    };
  }

  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {}
  };
}
export function App() {
  return <Layout></Layout>;
}
