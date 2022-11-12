import { QueryClientProvider } from '@tanstack/react-query';
import 'react-spring-bottom-sheet/dist/style.css';
import { queryClient } from './api/queryClient';
import './main-ui.css';
import { RoutesContainer } from './routes';

export function MainUI() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RoutesContainer />
        {/* <ReactQueryDevtools
          initialIsOpen={false}
          position="top-left"
          panelPosition="top"
        /> */}
      </QueryClientProvider>
    </div>
  );
}

export default MainUI;
