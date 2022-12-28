import { Plane, useTexture } from '@react-three/drei';

export const Terrain = () => {
  const { colors, height, normals } = useTexture({
    height: './assets/elevation.png',
    normals: './assets/NormalMap.png',
    colors: './assets/colors.png',
  });

  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
      args={[64, 64, 1024, 1024]}
    >
      <meshStandardMaterial
        color="white"
        map={colors}
        metalness={0.2}
        displacementMap={height}
        normalMap={normals}
      />
    </Plane>
  );
};
