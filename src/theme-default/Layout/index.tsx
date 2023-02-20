import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import '../styles/base.css';
import '../styles/vars.css';
import '../styles/doc.css';
import 'uno.css';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout></HomeLayout>;
    } else if (pageType === 'doc') {
      return <DocLayout></DocLayout>;
    } else {
      return <div>404</div>;
    }
  };

  return (
    <div>
      <Nav></Nav>
      <section style={{ paddingTop: 'var(--island-nav-height)' }}>
        {getContent()}
      </section>
    </div>
  );
}
