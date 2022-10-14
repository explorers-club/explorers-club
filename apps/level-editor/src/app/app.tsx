import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  defineHex,
  Grid,
  HexCoordinates,
  Orientation,
  spiral,
} from 'honeycomb-grid';
import PNG from 'png-ts';
import {
  ChangeEvent,
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { BufferGeometry, Color, ExtrudeBufferGeometry } from 'three';
import * as THREE from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import create from 'zustand';
import { stringify } from 'querystring';

const StyledApp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface HeightmapState {
  heightmap: PNG | undefined;
  loading: boolean;
  loadFromURL: (url: string) => void;
}

const useHeightmapStore = create<HeightmapState>((set, get) => ({
  heightmap: undefined,
  loading: false,
  loadFromURL: async (url: string) => {
    if (get().loading || get().heightmap) {
      return;
    }
    set({ loading: true });
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const heightmap = PNG.load(new Uint8Array(arrayBuffer));
    if (
      heightmap.height !== INPUT_IMAGE_HEIGHT ||
      heightmap.width !== INPUT_IMAGE_WIDTH
    ) {
      throw new Error(
        `heightmap doesnt match expected dimensions ${INPUT_IMAGE_WIDTH}x${INPUT_IMAGE_HEIGHT}`
      );
    }
    set({ heightmap, loading: false });
  },
}));

export function App() {
  const { loadFromURL } = useHeightmapStore();
  useEffect(() => {
    loadFromURL('./assets/heightmap.png');
  }, [loadFromURL]);

  return (
    <StyledApp>
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [0, 0, 5000], far: 30000 }}
      >
        <Editor />
      </Canvas>
    </StyledApp>
  );
}

const BASE_HEX_WIDTH = 560;
const BASE_HEX_HEIGHT = 480;

const INPUT_IMAGE_WIDTH = 2 * BASE_HEX_WIDTH;
const INPUT_IMAGE_HEIGHT = 2 * BASE_HEX_HEIGHT;

class BaseHex extends defineHex({
  dimensions: { width: BASE_HEX_WIDTH, height: BASE_HEX_HEIGHT },
  orientation: Orientation.FLAT,
}) {
  elevation!: number;

  static create(coordinates: HexCoordinates, elevation: number) {
    const hex = new BaseHex(coordinates);
    hex.elevation = elevation;
    return hex;
  }
}

const useIndexedHexTree = (heightmap?: PNG) => {
  return useMemo(() => {
    if (!heightmap) {
      return;
    }

    const baseGrid = new Grid(BaseHex, spiral({ radius: 1 }));

    // Next... for every pixel in the grid
    // If it has a value, create
    // const counts: Record<string, number> = {};
    // for (let x = 0; x < heightmap.width; x++) {
    //   for (let y = 0; y < heightmap.height; y++) {
    //     // TODO figure out how to get the right hexes for each point x,y
    //   }
    // }
    // console.log(counts);

    return { baseGrid };
  }, [heightmap]);
};

export function Editor() {
  const color = useMemo(() => new Color('#FFCBBE').convertSRGBToLinear(), []);

  return (
    <Fragment>
      <color attach="background" args={['#FFEECC']} />
      <pointLight
        args={[color, 80, 200]}
        position={[10, 20, 10]}
        castShadow={true}
      />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <Heightmap />
        <HexGrid />
        <OrbitControls autoRotate autoRotateSpeed={0.6} enablePan={false} />
      </Suspense>
    </Fragment>
  );
}

function Heightmap() {
  const { heightmap } = useHeightmapStore();
  const texture = useTexture('./assets/heightmap.png');

  if (!heightmap) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <mesh position={[0, 0, 50]}>
      <planeBufferGeometry args={[heightmap.width, heightmap.height]} />
      <meshBasicMaterial map={texture} />;
    </mesh>
  );
}

// URL.createObjectURL(new Blob([heightmap.imgData], { type: 'image/png' })),

function HexGrid() {
  const { heightmap } = useHeightmapStore();
  const hexTree = useIndexedHexTree(heightmap);
  const grid = hexTree?.baseGrid;

  const geo = useMemo(() => {
    if (!grid) {
      return;
    }

    const geos: BufferGeometry[] = [];
    grid.forEach((h) => {
      const extrudeSettings = {
        depth: h.elevation,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 1,
        bevelThickness: 1,
      };
      const shape = new THREE.Shape();
      const c0 = h.corners[0];
      shape.moveTo(c0.x, c0.y);
      for (let i = 1; i < h.corners.length; i++) {
        const corner = h.corners[i];
        shape.lineTo(corner.x, corner.y);
      }

      const geo = new ExtrudeBufferGeometry(shape, extrudeSettings);
      geos.push(geo);
    });

    if (geos.length === 0) {
      throw new Error('trying to render without any grid items');
    }

    const out = mergeBufferGeometries(geos);
    if (!out) {
      throw new Error('unexpected error merging buffer geometries');
    }
    return out;
  }, [grid]);
  const [stoneTexture] = useTexture(['./assets/stone.png']);

  if (!geo) {
    return null;
  }

  return (
    <mesh geometry={geo} castShadow={true} receiveShadow={true}>
      <meshPhysicalMaterial
        // envMap={envMap}
        envMapIntensity={0.135}
        flatShading={true}
        map={stoneTexture}
      />
    </mesh>
  );
}

// interface TerrainProps {
//   grid: Grid<Hex>;
// }

// const Terrain = ({ grid }: TerrainProps) => {
//   const [dirtTexture, dirt2Texture, grassTexture, sandTexture, stoneTexture] =
//     useTexture([
//       './assets/dirt.png',
//       './assets/dirt2.jpeg',
//       './assets/grass.jpeg',
//       './assets/sand.jpeg',
//       './assets/stone.png',
//     ]);

//   const { position } = useControls({
//     position: { x: 0, y: 0 },
//     boxSize: [10, 20],
//   });
//   console.log(position);
//   const { stoneHeight, dirtHeight, grassHeight, sandHeight, dirt2Height } =
//     useControls('Terrain Heights', {
//       stoneHeight: {
//         value: 8,
//         min: 0,
//         max: 10,
//         step: 1,
//       },
//       dirtHeight: {
//         value: 7,
//         min: 0,
//         max: 10,
//         step: 1,
//       },
//       grassHeight: {
//         value: 5,
//         min: 0,
//         max: 10,
//         step: 1,
//       },
//       sandHeight: {
//         value: 3,
//         min: 0,
//         max: 10,
//         step: 1,
//       },
//       dirt2Height: {
//         value: 0,
//         min: 0,
//         max: 10,
//         step: 1,
//       },
//     });

//   const { stoneGeo, dirtGeo, dirt2Geo, sandGeo, grassGeo, cloudsGeo } =
//     useMemo(() => {
//       let geometries: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let stoneGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let dirtGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let dirt2Geo: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let sandGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let grassGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
//       let cloudsGeo: BufferGeometry = new SphereGeometry(0, 0, 0);

//       const makeHex = (hex: Hex) => {
//         const height = hex.elevation;
//         const geo = getHexGeometry(hex);
//         geometries = mergeBufferGeometriesWithError([geometries, geo]);

//         if (height > stoneHeight) {
//           stoneGeo = mergeBufferGeometriesWithError([geo, stoneGeo]);

//           if (Math.random() > 0.6) {
//             stoneGeo = mergeBufferGeometriesWithError([
//               stoneGeo,
//               getStoneGeometry(hex),
//             ]);
//           }
//         } else if (height > dirtHeight) {
//           dirtGeo = mergeBufferGeometriesWithError([geo, dirtGeo]);

//           if (Math.random() > 0.8) {
//             grassGeo = mergeBufferGeometriesWithError([
//               grassGeo,
//               getTreeGeometry(hex),
//             ]);
//           }
//         } else if (height > grassHeight) {
//           grassGeo = mergeBufferGeometriesWithError([geo, grassGeo]);
//         } else if (height > sandHeight) {
//           sandGeo = mergeBufferGeometriesWithError([geo, sandGeo]);
//         } else if (height > dirt2Height) {
//           dirt2Geo = mergeBufferGeometriesWithError([geo, dirt2Geo]);
//         }
//       };

//       const cloudCount = Math.floor(Math.pow(Math.random(), 0.45) * 4);
//       for (let i = 0; i < cloudCount; i++) {
//         const puff1 = new SphereGeometry(1.2, 7, 7);
//         const puff2 = new SphereGeometry(1.5, 7, 7);
//         const puff3 = new SphereGeometry(0.9, 7, 7);

//         puff1.translate(-1.85, Math.random() * 0.3, 0);
//         puff2.translate(0, Math.random() * 0.3, 0);
//         puff3.translate(1.85, Math.random() * 0.3, 0);

//         const cloudGeo = mergeBufferGeometriesWithError([puff1, puff2, puff3]);
//         cloudGeo.translate(
//           Math.random() * 20 - 10,
//           Math.random() * 7 + 7,
//           Math.random() * 20 - 10
//         );
//         cloudGeo.rotateY(Math.random() * Math.PI * 2);

//         cloudsGeo = mergeBufferGeometriesWithError([cloudsGeo, cloudGeo]);
//       }

//       grid.forEach((hex) => {
//         makeHex(hex);
//       });

//       return { stoneGeo, grassGeo, dirt2Geo, dirtGeo, sandGeo, cloudsGeo };
//     }, [grid, dirtHeight, sandHeight, dirt2Height, grassHeight, stoneHeight]);

//   return (
//     <>
//       <mesh geometry={dirtGeo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.135}
//           flatShading={true}
//           map={dirtTexture}
//         />
//       </mesh>
//       <mesh geometry={stoneGeo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.135}
//           flatShading={true}
//           map={stoneTexture}
//         />
//       </mesh>
//       <mesh geometry={dirt2Geo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.135}
//           flatShading={true}
//           map={dirt2Texture}
//         />
//       </mesh>
//       <mesh geometry={grassGeo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.135}
//           flatShading={true}
//           map={grassTexture}
//         />
//       </mesh>
//       <mesh geometry={sandGeo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.135}
//           flatShading={true}
//           map={sandTexture}
//         />
//       </mesh>
//       <mesh geometry={cloudsGeo} castShadow={true} receiveShadow={true}>
//         <meshPhysicalMaterial
//           // envMap={envMap}
//           envMapIntensity={0.75}
//           flatShading={true}
//         />
//       </mesh>
//     </>
//   );
// };

function mergeBufferGeometriesWithError(geometries: BufferGeometry[]) {
  const result = mergeBufferGeometries(geometries);
  if (result === null) {
    throw Error('expected non-null result from merge buffer geometries');
  }
  return result;
}

// const getHexGeometry = (hex: Hex) => {
//   const geo = new CylinderGeometry(1, 1, hex.elevation, 6, 1, false);
//   geo.translate(hex.x, hex.elevation * 0.5, hex.y);

//   return geo;
// };

// const getStoneGeometry = (hex: Hex) => {
//   const px = Math.random() * 0.4;
//   const pz = Math.random() * 0.4;

//   const geo = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
//   geo.translate(hex.x + px, hex.elevation, hex.y + pz);

//   return geo;
// };

// const getTreeGeometry = (hex: Hex) => {
//   const treeHeight = Math.random() * 1 + 1.25;

//   const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
//   geo.translate(hex.x, hex.elevation + treeHeight * 0 + 1, hex.y);

//   const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
//   geo2.translate(hex.x, hex.elevation + treeHeight * 0.6 + 1, hex.y);

//   const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
//   geo3.translate(hex.x, hex.elevation + treeHeight * 1.25 + 1, hex.y);

//   return mergeBufferGeometriesWithError([geo, geo2, geo3]);
// };

export default App;
