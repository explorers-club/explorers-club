import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import chroma from 'chroma-js';
import { useControls } from 'leva';
import { Hex } from '@explorers-club/world';
import PNG from 'png-ts';
import {
  ChangeEvent,
  Fragment,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  SphereGeometry,
} from 'three';
import { mergeBufferGeometries, SimplexNoise } from 'three-stdlib';
import { Grid, HexCoordinates, spiral } from 'honeycomb-grid';

const simplex = new SimplexNoise();

const StyledApp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type ImageInputData = {
  x: number;
  y: number;
  elevation: number;
};

export function App() {
  const [imageInputData, setImageInputData] = useState<ImageInputData[]>();

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      if (!file) {
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const png = PNG.load(data);
      const values = png.decodePixels();

      const result: ImageInputData[] = [];

      for (let x = 0; x < png.width; x++) {
        for (let y = 0; y < png.height; y++) {
          const index = y * png.width + x;
          const value = chroma([
            values[index],
            values[index + 1],
            values[index + 2],
          ]).hsv()[2];

          result.push({
            x,
            y,
            elevation: 1 - value,
          });
        }
      }

      setImageInputData(result);
    },
    [setImageInputData]
  );

  return (
    <StyledApp>
      <input type="file" name="file" onChange={handleFileUpload} />
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [0, 0, 50] }}
      >
        <Editor imageInputData={imageInputData} />
      </Canvas>
    </StyledApp>
  );
}

type EditorProps = {
  imageInputData?: ImageInputData[];
};

export function Editor({ imageInputData }: EditorProps) {
  const color = useMemo(() => new Color('#FFCBBE').convertSRGBToLinear(), []);
  const grid = useMemo(() => {
    // console.log({ imageInputData });
    if (imageInputData) {
      // const tiles = new Set<HexCoordinates>(
      //   imageInputData.map(({ x, y }) => [x, y])
      // );
      
      // const grid = new Grid(Hex, tiles);
      // imageInputData.forEach(({ x, y, elevation }) => {
      //   const hex = grid.getHex({ r: x, q: y });
      //   if (hex) {
      //     hex.elevation = elevation;
      //   }
      // });
      // console.log('set elevations')
      const grid = new Grid(Hex, spiral({ radius: 20 }));
      grid.forEach((hex) => {
        const noise = (simplex.noise(hex.q * 0.1, hex.r * 0.1) + 1) * 0.5;
        hex.elevation = Math.pow(noise, 1.5) * 10;
      });
      return grid;
    } else {
      const grid = new Grid(Hex, spiral({ radius: 50 }));
      grid.forEach((hex) => {
        const noise = (simplex.noise(hex.q * 0.1, hex.r * 0.1) + 1) * 0.5;
        hex.elevation = Math.pow(noise, 1.5) * 10;
      });
      return grid;
    }
  }, [imageInputData]);

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
        <Terrain grid={grid} />
        <OrbitControls autoRotate autoRotateSpeed={0.6} enablePan={false} />
      </Suspense>
    </Fragment>
  );
}

interface TerrainProps {
  grid: Grid<Hex>;
}

const Terrain = ({ grid }: TerrainProps) => {
  const [dirtTexture, dirt2Texture, grassTexture, sandTexture, stoneTexture] =
    useTexture([
      './assets/dirt.png',
      './assets/dirt2.jpeg',
      './assets/grass.jpeg',
      './assets/sand.jpeg',
      './assets/stone.png',
    ]);

  const {
    maxHeight,
    stoneHeightMultiplier,
    dirtHeightMultiplier,
    grassHeightMultiplier,
    sandHeightMultiplier,
    dirt2HeightMultiplier,
  } = useControls({
    maxHeight: {
      value: 10,
      min: 1,
      max: 30,
      step: 1,
    },
    stoneHeightMultiplier: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dirtHeightMultiplier: {
      value: 0.7,
      min: 0,
      max: 1,
      step: 0.01,
    },
    grassHeightMultiplier: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    sandHeightMultiplier: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dirt2HeightMultiplier: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });
  const stoneHeight = maxHeight * stoneHeightMultiplier;
  const dirtHeight = maxHeight * dirtHeightMultiplier;
  const dirt2Height = maxHeight * dirt2HeightMultiplier;
  const sandHeight = maxHeight * sandHeightMultiplier;
  const grassHeight = maxHeight * grassHeightMultiplier;

  const { stoneGeo, dirtGeo, dirt2Geo, sandGeo, grassGeo, cloudsGeo } =
    useMemo(() => {
      let geometries: BufferGeometry = new BoxGeometry(0, 0, 0);
      let stoneGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
      let dirtGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
      let dirt2Geo: BufferGeometry = new BoxGeometry(0, 0, 0);
      let sandGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
      let grassGeo: BufferGeometry = new BoxGeometry(0, 0, 0);
      let cloudsGeo: BufferGeometry = new SphereGeometry(0, 0, 0);

      const makeHex = (hex: Hex) => {
        const height = hex.elevation;
        const geo = getHexGeometry(hex);
        geometries = mergeBufferGeometriesWithError([geometries, geo]);

        if (height > stoneHeight) {
          stoneGeo = mergeBufferGeometriesWithError([geo, stoneGeo]);

          if (Math.random() > 0.6) {
            stoneGeo = mergeBufferGeometriesWithError([
              stoneGeo,
              getStoneGeometry(hex),
            ]);
          }
        } else if (height > dirtHeight) {
          dirtGeo = mergeBufferGeometriesWithError([geo, dirtGeo]);

          if (Math.random() > 0.8) {
            grassGeo = mergeBufferGeometriesWithError([
              grassGeo,
              getTreeGeometry(hex),
            ]);
          }
        } else if (height > grassHeight) {
          grassGeo = mergeBufferGeometriesWithError([geo, grassGeo]);
        } else if (height > sandHeight) {
          sandGeo = mergeBufferGeometriesWithError([geo, sandGeo]);
        } else if (height > dirt2Height) {
          dirt2Geo = mergeBufferGeometriesWithError([geo, dirt2Geo]);
        }
      };

      const cloudCount = Math.floor(Math.pow(Math.random(), 0.45) * 4);
      for (let i = 0; i < cloudCount; i++) {
        const puff1 = new SphereGeometry(1.2, 7, 7);
        const puff2 = new SphereGeometry(1.5, 7, 7);
        const puff3 = new SphereGeometry(0.9, 7, 7);

        puff1.translate(-1.85, Math.random() * 0.3, 0);
        puff2.translate(0, Math.random() * 0.3, 0);
        puff3.translate(1.85, Math.random() * 0.3, 0);

        const cloudGeo = mergeBufferGeometriesWithError([puff1, puff2, puff3]);
        cloudGeo.translate(
          Math.random() * 20 - 10,
          Math.random() * 7 + 7,
          Math.random() * 20 - 10
        );
        cloudGeo.rotateY(Math.random() * Math.PI * 2);

        cloudsGeo = mergeBufferGeometriesWithError([cloudsGeo, cloudGeo]);
      }

      grid.forEach((hex) => {
        makeHex(hex);
      });

      return { stoneGeo, grassGeo, dirt2Geo, dirtGeo, sandGeo, cloudsGeo };
    }, [grid, dirtHeight, sandHeight, dirt2Height, grassHeight, stoneHeight]);

  return (
    <>
      <mesh geometry={dirtGeo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.135}
          flatShading={true}
          map={dirtTexture}
        />
      </mesh>
      <mesh geometry={stoneGeo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.135}
          flatShading={true}
          map={stoneTexture}
        />
      </mesh>
      <mesh geometry={dirt2Geo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.135}
          flatShading={true}
          map={dirt2Texture}
        />
      </mesh>
      <mesh geometry={grassGeo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.135}
          flatShading={true}
          map={grassTexture}
        />
      </mesh>
      <mesh geometry={sandGeo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.135}
          flatShading={true}
          map={sandTexture}
        />
      </mesh>
      <mesh geometry={cloudsGeo} castShadow={true} receiveShadow={true}>
        <meshPhysicalMaterial
          // envMap={envMap}
          envMapIntensity={0.75}
          flatShading={true}
        />
      </mesh>
    </>
  );
};

function mergeBufferGeometriesWithError(geometries: BufferGeometry[]) {
  const result = mergeBufferGeometries(geometries);
  if (result === null) {
    throw Error('expected non-null result from merge buffer geometries');
  }
  return result;
}

const getHexGeometry = (hex: Hex) => {
  const geo = new CylinderGeometry(1, 1, hex.elevation, 6, 1, false);
  geo.translate(hex.x, hex.elevation * 0.5, hex.y);

  return geo;
};

const getStoneGeometry = (hex: Hex) => {
  const px = Math.random() * 0.4;
  const pz = Math.random() * 0.4;

  const geo = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
  geo.translate(hex.x + px, hex.elevation, hex.y + pz);

  return geo;
};

const getTreeGeometry = (hex: Hex) => {
  const treeHeight = Math.random() * 1 + 1.25;

  const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
  geo.translate(hex.x, hex.elevation + treeHeight * 0 + 1, hex.y);

  const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
  geo2.translate(hex.x, hex.elevation + treeHeight * 0.6 + 1, hex.y);

  const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
  geo3.translate(hex.x, hex.elevation + treeHeight * 1.25 + 1, hex.y);

  return mergeBufferGeometriesWithError([geo, geo2, geo3]);
};

export default App;
