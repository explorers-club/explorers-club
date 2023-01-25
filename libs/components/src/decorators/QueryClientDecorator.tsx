import { Args, DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const withQueryClient: DecoratorFunction<ReactFramework, Args> = (
  Story
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [client] = useState(() => new QueryClient());
  console.log(client);
  return (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  );
};
