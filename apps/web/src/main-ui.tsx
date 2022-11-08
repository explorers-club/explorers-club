import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useCallback, useContext, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
// import styled from 'styled-components';
import { queryClient } from './api/queryClient';
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
      <QueryClientProvider client={queryClient}>
        <BottomSheet
          open={open}
          onDismiss={handleDismiss}
          blocking={false}
          snapPoints={({ minHeight }) => [minHeight + 24]}
          ref={sheetRef}
        >
          <RoutesContainer />
        </BottomSheet>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

// const Background = styled.div`
//   position: absolute;
//   padding-top: 64px;
//   display: flex;
// `;

export default MainUI;
