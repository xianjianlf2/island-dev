import { createRoot } from 'react-dom/client';
import { App } from './App';

function renderInBrowser() {
  const containEl = document.getElementById('root');
  if (!containEl) {
    throw new Error('#root element not found');
  }
  createRoot(containEl).render(<App />);
}

renderInBrowser();
