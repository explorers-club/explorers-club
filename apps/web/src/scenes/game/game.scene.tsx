import {
  Environment,
  OrbitControls,
  PositionalAudio,
  useTexture,
} from '@react-three/drei';
import { defineHex, Grid, spiral } from 'honeycomb-grid';
import { useControls } from 'leva';
import { Fragment, Suspense, useMemo, useState } from 'react';
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  SphereGeometry,
} from 'three';
import { mergeBufferGeometries, SimplexNoise } from 'three-stdlib';

export function GameScene() {
  const color = useMemo(() => new Color('#FFCBBE').convertSRGBToLinear(), []);
  // const envMap = useLoader(RGBELoader, "./assets/envmap.hdr");

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
        <Ship />
        <Terrain />
        <Sea />
        <MapContainer />
        <MapFloor />
        <OrbitControls autoRotate autoRotateSpeed={0.6} enablePan={false} />
      </Suspense>
    </Fragment>
  );
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

const MAX_HEIGHT = 10;

const useBoardRadius = () => {
  return 20;
};

const MapFloor = () => {
  const boardRadius = useBoardRadius();
  const texture = useTexture('./assets/dirt.png');
  return (
    <mesh receiveShadow={true} position={[0, -MAX_HEIGHT * 0.05, 0]}>
      <cylinderGeometry
        args={[boardRadius + 1.5, boardRadius + 1.5, MAX_HEIGHT * 0.1, 50]}
      />
      <meshPhysicalMaterial
        map={texture}
        envMapIntensity={0.1}
        side={DoubleSide}
      />
    </mesh>
  );
};

const MapContainer = () => {
  const boardRadius = useBoardRadius();
  const texture = useTexture('./assets/dirt2.jpeg');
  return (
    <mesh receiveShadow={true} position={[0, MAX_HEIGHT * 0.125, 0]}>
      <cylinderGeometry
        args={[
          boardRadius + 0.1,
          boardRadius + 0.1,
          MAX_HEIGHT * 0.25,
          50,
          1,
          true,
        ]}
      />
      <meshPhysicalMaterial
        map={texture}
        envMapIntensity={0.1}
        side={DoubleSide}
      />
    </mesh>
  );
};

const Sea = () => {
  const seaColor = useMemo(
    () => new Color('#55aaff').convertSRGBToLinear().multiplyScalar(3),
    []
  );
  const waterTexture = useTexture('./assets/water.jpeg');
  const { boardRadius } = useControls({
    boardRadius: 20,
  });

  return (
    <mesh receiveShadow={true} position={[0, 0.1, 0]}>
      <cylinderGeometry args={[boardRadius, boardRadius, 10 * 0.2, 50]} />
      <meshPhysicalMaterial
        // envMap={envMap}
        color={seaColor}
        ior={1.4}
        transmission={1}
        transparent={true}
        envMapIntensity={0.2}
        roughness={1}
        metalness={0.025}
        roughnessMap={waterTexture}
        metalnessMap={waterTexture}
      ></meshPhysicalMaterial>
    </mesh>
  );
};

const Ship = () => {
  const [pos] = useState({
    x: 25,
    y: 10,
  });

  return (
    <mesh receiveShadow={true} position={[pos.x, 1.5, pos.y]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
};

const simplex = new SimplexNoise();

class Hex extends defineHex({ dimensions: { xRadius: 1, yRadius: 1 } }) {
  elevation!: number;
}

const Terrain = () => {
  const [dirtTexture, dirt2Texture, grassTexture, sandTexture, stoneTexture] =
    useTexture([
      './assets/dirt.png',
      './assets/dirt2.jpeg',
      './assets/grass.jpeg',
      './assets/sand.jpeg',
      './assets/stone.png',
    ]);

  const grid = new Grid(Hex, spiral({ radius: 10 }));
  grid.forEach((hex) => {
    const noise = (simplex.noise(hex.q * 0.1, hex.r * 0.1) + 1) * 0.5;
    hex.elevation = Math.pow(noise, 1.5) * 10;
  });

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
      <group position={[0, 0, 0]}>
        {/* <PositionalAudio
          autoplay
          loop
          url="./assets/lobbymusic.mp3"
          distance={5}
        /> */}
        <PositionalAudio
          autoplay
          loop
          url="./assets/watersounds.mp3"
          distance={5}
        />
      </group>
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

export default GameScene;
