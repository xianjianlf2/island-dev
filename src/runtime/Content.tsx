import { useRoutes } from 'react-router-dom';
import { routes } from 'island:routes';

// const routes = [
//   {
//     path: '/guide',
//     element: <Index></Index>
//   },
//   {
//     path: '/guide/a',
//     element: <A></A>
//   },
//   {
//     path: '/b',
//     element: <B></B>
//   }
// ];

export const Content = () => {
  console.log(routes);
  const rootElement = useRoutes(routes);
  return rootElement;
};
