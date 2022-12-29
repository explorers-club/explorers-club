import { transformer, trpc } from '@explorers-club/api-client';
import {
  MapControls,
  OrbitControls,
  OrthographicCamera,
  useHelper,
} from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Meta } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Suspense, useState, useRef } from 'react';
import { CameraHelper, Vector3 } from 'three';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { HexMap } from './hex-map.component';

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
      // const cameraRef = useRef(null);
      // useHelper(cameraRef, CameraHelper)
      return (
        <CanvasSetup
          orthographic
          cameraPosition={new Vector3(0, 1, 0)}
          controls={false}
        >
          <OrbitControls />
          {/* <MapControls /> */}
          {/* <OrthographicCamera position={[0, 500, 0]} makeDefault zoom={40} />
          <ambientLight intensity={0.8} /> */}
          {/* <MapControls /> */}
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={null}>
                <Story />
              </Suspense>
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
