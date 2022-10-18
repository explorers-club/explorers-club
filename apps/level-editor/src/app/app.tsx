import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import chroma from 'chroma-js';
import {
  BoundingBox,
  defineHex,
  Grid,
  Hex,
  HexCoordinates,
  Orientation,
  rectangle,
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
        camera={{ position: [0, 0, 2000], far: 5000 }}
      >
        <Editor />
      </Canvas>
    </StyledApp>
  );
}

const BASE_HEX_WIDTH = 960;
const BASE_HEX_HEIGHT = 1120;

const INPUT_IMAGE_WIDTH = 2.5 * BASE_HEX_WIDTH;
const INPUT_IMAGE_HEIGHT = 2.5 * BASE_HEX_HEIGHT;

const MIN_RESOLUTION = 0;
const MAX_RESOLUTION = 7;

const getHexBoundingBox: (resolution: number) => BoundingBox = (resolution) => {
  if (resolution === MIN_RESOLUTION) {
    return { width: BASE_HEX_WIDTH, height: BASE_HEX_HEIGHT };
  }

  const { width, height } = getHexBoundingBox(resolution - 1);
  return {
    width: width / Math.sqrt(3),
    height: height / Math.sqrt(3),
  };
};

const getHexOrientation: (resolution: number) => Orientation = (resolution) => {
  return resolution % 2 ? Orientation.FLAT : Orientation.POINTY;
};

const createGrids = () => {
  const grids = [];
  // Create a grid at each resolution
  for (
    let resolution = MIN_RESOLUTION;
    resolution < MAX_RESOLUTION;
    resolution++
  ) {
    const { width, height } = getHexBoundingBox(resolution);

    const Hex = defineHex({
      dimensions: { width, height },
      orientation: getHexOrientation(resolution),
    });
    const grid = new Grid(Hex);
    grids.push(grid);
  }
  return grids;
};

const useIndexedHexTree = (heightmap?: PNG) => {
  return useMemo(() => {
    if (!heightmap) {
      return;
    }

    const grids = createGrids();
    const baseGrid = grids[0];

    // TODO NEXT... for every pixel in the grid
    // insert it in to the hex grid at each
    const pixels = heightmap.decodePixels();

    console.log('creating grids');

    for (let x = 0; x < heightmap.width; x++) {
      for (let y = 0; y < heightmap.height; y++) {
        const index = x * 4 + y * heightmap.width * 4;
        const value = chroma([
          pixels[index],
          pixels[index + 1],
          pixels[index + 2],
        ]).hsv()[2];

        if (value === 0) {
          continue;
        }

        grids.forEach((grid) => {
          const coords = { x, y };
          const hex = grid.pointToHex(coords); // TODO adjust this by some offset
          if (!grid.hasHex(hex)) {
            grid.setHexes([hex]);
          }
        });
      }
    }
    console.log(grids);
    grids.forEach(console.log);

    grids.forEach((grid) => {
      console.log(grid.size);
    });
    baseGrid.forEach(console.log);

    // const counts: Record<string, number> = {};
    // const pixels = heightmap.decodePixels();
    // const counts: Record<string, number> = {};

    // const hexes: BaseHex[] = [];
    // for (let x = 0; x < heightmap.width; x++) {
    //   for (let y = 0; y < heightmap.height; y++) {
    //     const index = x * 4 + y * heightmap.width * 4;
    //     const value = chroma([
    //       pixels[index],
    //       pixels[index + 1],
    //       pixels[index + 2],
    //     ]).hsv()[2];

    //     if (value === 0) {
    //       continue;
    //     }

    //     const adjustedX = x - INPUT_IMAGE_WIDTH / 2;
    //     const adjustedY = y - INPUT_IMAGE_HEIGHT / 2;
    //     hexes.push(
    //       BaseHex.create({ col: adjustedX, row: adjustedY }, 5, 0, value)
    //     );

    //     // Shift x and y so that we match up with the hex grid

    //     // Find which cell we belong to in the base hex grid.
    //   }
    // }
    // baseGrid.setHexes(hexes);
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
        {/* <Heightmap /> */}
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
      <meshStandardMaterial map={texture} />;
    </mesh>
  );
}

function HexGrid() {
  const { heightmap } = useHeightmapStore();
  const hexTree = useIndexedHexTree(heightmap);
  const grid = hexTree?.baseGrid;

  const handlePressGrid = useCallback((event: ThreeEvent<MouseEvent>) => {
    console.log(event.point);
  }, []);

  const geo = useMemo(() => {
    if (!grid) {
      return;
    }

    const geos: BufferGeometry[] = [];
    const shape = new THREE.Shape();
    grid.forEach((h) => {
      const extrudeSettings = {
        depth: 1,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 1,
        bevelThickness: 1,
      };
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
    <mesh
      onClick={handlePressGrid}
      geometry={geo}
      castShadow={true}
      receiveShadow={true}
    >
      <meshPhysicalMaterial
        // envMap={envMap}
        envMapIntensity={0.135}
        flatShading={true}
        map={stoneTexture}
      />
    </mesh>
  );
}

export default App;
