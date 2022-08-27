import styled from 'styled-components';
import MainCanvas from './main-canvas';
import { useInterpret } from '@xstate/react';
import { appMachine } from './app.machine';
import { AppServiceContext } from './app.service';
import MainUI from './main-ui';

export function App() {
  const appService = useInterpret(appMachine);

  return (
    <Body>
      <AppServiceContext.Provider value={appService}>
        <MainUI />
        <MainCanvas />
      </AppServiceContext.Provider>
    </Body>
  );
}

const Body = styled.div`
  // Your style here
`;

export default App;
