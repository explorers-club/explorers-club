import { transformer, trpc } from '@explorers-club/api-client';
import { Args, DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

export const withTrpcClient: DecoratorFunction<ReactFramework, Args> = (
  Story
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [queryClient] = useState(() => new QueryClient());
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        httpBatchLink({
          url: `http://localhost:4400/api`, // todo change to current port
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
