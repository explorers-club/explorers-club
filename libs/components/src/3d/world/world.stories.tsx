import { transformer, trpc } from '@explorers-club/api-client';
import { Meta } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { SunsetSky } from '../sky/sky.component';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { World } from './world.component';

// geoJson.features.

export default {
  component: World,
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
          // orthographic
          camera={{ position: [0, 0, 50], zoom: 10, up: [0, 0, 1], far: 10000 }}
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Story />
              <SunsetSky />
            </QueryClientProvider>
          </trpc.Provider>
        </CanvasSetup>
      );
    },
  ],
} as Meta;

export const Primary = {
  render: () => {
    return (
      <World globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg" />
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

// export const Primary = {
//   render: () => {
//     const alt = 50;
//     //     const lineObjs: LineSegments = [];
//     //     const materials = [
//     //       new THREE.LineBasicMaterial({ color: 'blue' }), // outer ring
//     //       new THREE.LineBasicMaterial({ color: 'green' }), // inner holes
//     //     ];
//     //     countries.features.forEach(({ properties, geometry }) => {
//     //       lineObjs.push(
//     //         new THREE.LineSegments(new GeoJsonGeometry(geometry, alt), materials)
//     //       );
//     //     });

//     //     return <>{lineObjs}</>;

//     //     const feature = countries.features[0];
//     //     feature.geometry
//     //     return <World geoJson={geoJson} />;
//     return (
//       <>
//         <mesh>
//           <sphereGeometry />
//           <meshBasicMaterial color="#111" />
//         </mesh>
//         <lineSegments>
//           <lineBasicMaterial color={'blue'} />
//           <lineBasicMaterial color={'green'} />
//         </lineSegments>
//       </>
//     );
//   },
//   parameters: {
//     layout: 'fullscreen',
//   },
// };

// const globe = new ThreeGlobe({ animateIn: false })
//   .hexPolygonResolution($resolution)
//   .labelResolution($resolution)
//   .hexPolygonMargin(0.1)
//   .globeImageUrl('/img/earth-dark.jpg')
//   .labelText((data) => {
//     return data && data.properties ? data.properties.iso3 || '' : '';
//   })
//   .labelColor(() => 'white')
//   .labelSize(2)
//   .labelAltitude(0.01)
//   .labelLat((d) => {
//     if (d && d.properties) {
//       return d.properties.latitude;
//     }
//     return 0;
//   })
//   .labelLng((d) => {
//     if (d.properties) {
//       return d.properties.longitude;
//     }
//     return 0;
//   })
//   .hexPolygonColor((country) => {
//     return colorOf(country);
//   });
// const globe = new ThreeGlobe();

// export const GlobeTest = {
//   render: () => {
//     return <primitive object={globe} />;
//   },
//   parameters: {
//     layout: 'fullscreen',
//   },
// };
