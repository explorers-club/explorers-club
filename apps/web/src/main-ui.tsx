// Routing setup inspired by https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
import { useCallback, useContext, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import styled from 'styled-components';
import './main-ui.css';
import { RoutesContainer } from './routes';
import { GlobalStateContext } from './state/global.provider';

export function MainUI() {
  const { sheetRef } = useContext(GlobalStateContext);

  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div>
      <Background>
        <Logo alt="Explorers Club Logo" src="./assets/logo.png" />
      </Background>
      <BottomSheet
        open={open}
        onDismiss={handleDismiss}
        blocking={false}
        snapPoints={({ minHeight }) => [minHeight + 24]}
        ref={sheetRef}
      >
        <RoutesContainer />
      </BottomSheet>
    </div>
  );
}

const Background = styled.div`
  position: absolute;
  padding-top: 64px;
  display: flex;
`;

const Logo = styled.img`
  display: block;
  width: 100%;
`;

export default MainUI;
