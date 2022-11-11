import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
// import styled from 'styled-components';
import { queryClient } from './api/queryClient';
import './main-ui.css';
import { RoutesContainer } from './routes';
import { Footer } from './routes/footer.container';
import { Header } from './routes/header.container';
import { GlobalStateContext } from './state/global.provider';

export function MainUI() {
  const { sheetRef } = useContext(GlobalStateContext);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BottomSheet
          open={true}
          blocking={false}
          defaultSnap={({ maxHeight }) => maxHeight / 2}
          snapPoints={({ maxHeight }) => [
            maxHeight - maxHeight / 10,
            maxHeight / 4,
            maxHeight * 0.6,
          ]}
          expandOnContentDrag={true}
          ref={sheetRef}
          header={<Header />}
          footer={<Footer />}
        >
          <RoutesContainer />
        </BottomSheet>
        <ReactQueryDevtools
          initialIsOpen={false}
          position="top-left"
          panelPosition="top"
        />
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
