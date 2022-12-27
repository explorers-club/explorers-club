import { transformer, trpc } from '@explorers-club/api-client';
import { Meta, Story } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as d3 from 'd3';
import { httpBatchLink } from '@trpc/client';
import { useContext, useMemo, useState } from 'react';
import ThreeGlobe from 'three-globe';
import { SunsetSky } from '../sky/sky.component';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { World } from './world.component';
import { countries } from './__stories/countries';

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
          camera={{ position: [0, 200, 2000], zoom: 10, far: 10000 }}
          //   lights={false}
        >
          {/* <pointLight intensity={1.2} position={[0, 0, -5000]} /> */}
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

export const HexPolygons: Story = (args) => {
  const globe = useMemo(() => {
    const globe = new ThreeGlobe();
    globe.globeImageUrl(
      '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    );
    globe.bumpImageUrl(
      '//unpkg.com/three-globe/example/img/earth-topology.png'
    );
    globe.hexPolygonsData(countries.features);
    globe.hexPolygonResolution(3);
    globe.hexPolygonMargin(0.1);
    globe.showGlobe(false);
    globe.showAtmosphere(false);
    globe.hexPolygonColor(
      () =>
        `#${Math.round(Math.random() * Math.pow(2, 24))
          .toString(16)
          .padStart(6, '0')}`
    );
    return globe;
  }, []);
  return <World globe={globe} />;
};

const weightColor = d3
  .scaleSequentialSqrt(d3.interpolateYlOrRd)
  .domain([0, 1e7]);

export const HexBins: Story = (args, loaded) => {
  const res = 4;
  const query = trpc.tile.allCells.useInfiniteQuery(
    {
      res,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const globe = useMemo(() => {
    if (!query.data) {
      return null;
    }

    const page = query.data.pages[0];
    if (!page) {
      return null;
    }

    const globe = new ThreeGlobe();
    globe.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg');
    globe.bumpImageUrl(
      '//unpkg.com/three-globe/example/img/earth-topology.png'
    );
    globe.hexBinPointsData(page.items);
    globe.hexBinPointWeight(3);
    globe.showGraticules(true);
    // globe.showAtmosphere(false);
    // globe.showGlobe(false);
    // globe.showGlobe(false);
    globe.hexBinResolution(res);
    globe.hexMargin(0.5);
    globe.hexAltitude((d) => d.sumWeight * 6e-3);
    globe.hexTopColor(() => 'red');
    globe.hexSideColor(() => 'rgba(0,255,0,0.8)');
    globe.hexBinMerge(true);

    return globe;
  }, [query.data]);

  if (!globe) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return <World globe={globe} />;
};

// https://github.com/vasturiano/three-globe/blob/master/example/ripples/index.html
export const Ripples: Story = (args) => {
  const globe = useMemo(() => {
    // Gen random data
    const N = 10;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      maxR: Math.random() * 20 + 3,
      propagationSpeed: (Math.random() - 0.5) * 20 + 1,
      repeatPeriod: Math.random() * 2000 + 200,
    }));

    const colorInterpolator = (t: number) => `rgba(255,100,50,${1 - t})`;

    const globe = new ThreeGlobe();
    globe.ringsData(gData);
    globe.ringColor(() => colorInterpolator);
    globe.ringMaxRadius('maxR');
    globe.ringPropagationSpeed('propagationSpeed');
    globe.ringRepeatPeriod('repeatPeriod');
    return globe;
  }, []);
  return <World globe={globe} />;
};

// HexBins.loaders = [
// 	async () => {
// 		useContext
// 	}
// ]

//   render: () => {
//     return (
//      <World globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" />
//     );
//   },
//   parameters: {
//     layout: 'fullscreen',
//   },
// };

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
