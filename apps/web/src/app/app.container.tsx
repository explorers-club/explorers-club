import { transformer, trpc } from '@explorers-club/api-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, wsLink } from '@trpc/client';
import { useState } from 'react';
import { EntityStoreProvider } from '../state/entity.context';
import { AppComponent } from './app.component';

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const wsClient = createWSClient({
    url: `ws://localhost:3001`,
  });
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <EntityStoreProvider>
          <AppComponent />
        </EntityStoreProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
