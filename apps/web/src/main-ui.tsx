import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, ReactNode } from 'react';
import 'react-spring-bottom-sheet/dist/style.css';
import { queryClient } from './api/queryClient';
import './main-ui.css';
import { RoutesContainer } from './routes';

export function MainUI() {
  // const footerProps = useSelector(navigationActor, selectFooterProps);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RoutesContainer />
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
