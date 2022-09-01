import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import MainCanvas from './main-canvas';
import MainUI from './main-ui';
import { GlobalStateProvider } from './state/global.provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <GlobalStateProvider>
      <MainCanvas />
      <MainUI />
    </GlobalStateProvider>
  </StrictMode>
);
