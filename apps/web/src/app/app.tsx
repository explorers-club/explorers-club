import styled from 'styled-components';
import MainCanvas from './main-canvas';
import { useInterpret } from '@xstate/react';
import { appMachine } from './app.machine';
import { AppServiceContext } from './app.service';
import MainUI from './main-ui';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  const appService = useInterpret(appMachine);

  return (
    <Body>
      <BrowserRouter>
        <AppServiceContext.Provider value={appService}>
          <MainUI />
          <MainCanvas />
        </AppServiceContext.Provider>
      </BrowserRouter>
    </Body>
  );
}

const Body = styled.div`
  // Your style here
`;

export default App;
