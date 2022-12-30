import { Plane, useTexture } from '@react-three/drei';
import Martini from '@mapbox/martini';
import { useMemo } from 'react';
import { MartiniComponent } from './martini.component';

// const getColorIndicesForCoord = (x: number, y: number, width: number) => {
//   const red = y * (width * 4) + x * 4;
//   return [red, red + 1, red + 2, red + 3];
// };
// const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);
// const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

export const Terrain = () => {
  const { colors, height, normals } = useTexture({
    height: './assets/elevation.png',
    normals: './assets/NormalMap.png',
    colors: './assets/colors.png',
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <MartiniComponent
        displacementMapUrl="./assets/elevation.png"
        error={10}
      />
      <meshStandardMaterial color="red" wireframe />
      {/* <meshStandardMaterial
        color="white"
        map={colors}
        metalness={0.2}
        displacementMap={height}
        normalMap={normals}
      /> */}
    </mesh>
  );
};
