import * as ReactDOM from 'react-dom/client';
import { App } from './app/app.container';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
