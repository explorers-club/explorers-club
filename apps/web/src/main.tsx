import * as ReactDOM from 'react-dom/client';
import { Routes } from './routes/routes.container';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <Routes />
  // </StrictMode>
);
