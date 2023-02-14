import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import '../styles/base.css';
import '../styles/vars.css';
import 'uno.css';
import { HomeLayout } from './HomeLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout></HomeLayout>;
    } else if (pageType === 'doc') {
      return <div>正文内容</div>;
    } else {
      return <div>404</div>;
    }
  };

  return (
    <div>
      <Nav></Nav>
      {getContent()}
    </div>
  );
}
