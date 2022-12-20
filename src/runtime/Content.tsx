import A from '../../docs/guide/a';
import B from '../../docs/b';
import Index from '../../docs/guide/index';
import { useRoutes } from 'react-router-dom';

const routes = [
  {
    path: '/guide',
    element: <Index></Index>
  },
  {
    path: '/guide/a',
    element: <A></A>
  },
  {
    path: '/b',
    element: <B></B>
  }
];

export const Content = () => {
  const rootElement = useRoutes(routes);
  return rootElement;
};
