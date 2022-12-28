import { Meta } from '@storybook/react';
import { HexMap } from './hex-map.component';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc, transformer } from '@explorers-club/api-client';

export default {
  component: HexMap,
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => new QueryClient());
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
        <CanvasSetup
          orthographic
          camera={{ position: [0, 0, 50], zoom: 10, up: [0, 0, 1], far: 10000 }}
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Story />
            </QueryClientProvider>
          </trpc.Provider>
        </CanvasSetup>
      );
    },
  ],
} as Meta;

export const Primary = {
  render: () => <HexMap />,
  parameters: {
    layout: 'fullscreen',
  },
};
