import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppComponent } from './app.component';

export const App = () => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppComponent />
    </QueryClientProvider>
  );
};
