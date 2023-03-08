import { useTexture } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import { FC, Suspense } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

interface Props {
  imageUrl: string;
}

export const PointAndClickScene: FC<Props> = ({ imageUrl }) => {
  const { gl } = useThree();
  const texture = useTexture('./assets/club.png');
  console.log(imageUrl);
  //   const formatted = new THREE.WebGLCubeRenderTarget(
  //     texture.image.height
  //   ).fromEquirectangularTexture(gl, texture);
  //   console.log(texture);
  //   const texture = useLoader(TextureLoader, url);

  return (
    <Suspense fallback={null}>
      <primitive attach="background" object={texture} />;
      {/* <ImagePlane imageUrl={'./assets/club.png'} /> */}
      {/* <primitive attach="background" object={formatted.texture} /> */}
      {/* <color attach="background" args={['#f4ef36']} /> */}
    </Suspense>
  );
};

interface ImagePlaneProps {
  imageUrl: string;
  size?: { width?: number; height?: number };
  fillMethod?: 'contain' | 'cover';
}

const ImagePlane: React.FC<ImagePlaneProps> = ({
  imageUrl,
  size = {},
  fillMethod = 'contain',
}) => {
  if ('width' in size === 'height' in size) {
    console.error(
      "Either 'width' or 'height' must be specified, but not both."
    );
    return null;
  }

  const texture = useLoader(TextureLoader, imageUrl);

  const textureAspect = new Vector2(texture.image.width, texture.image.height);
  const planeAspect = new Vector2(
    size.width ?? (size.height! * textureAspect.x) / textureAspect.y,
    size.height ?? (size.width! * textureAspect.y) / textureAspect.x
  );

  if (fillMethod === 'contain') {
    const maxDimension = Math.max(planeAspect.x, planeAspect.y);
    planeAspect.set(maxDimension, maxDimension);
  } else if (fillMethod === 'cover') {
    const minDimension = Math.min(planeAspect.x, planeAspect.y);
    planeAspect.set(minDimension, minDimension);
  }

  return (
    <mesh position={[0, -planeAspect.y / 2, 0]}>
      <planeBufferGeometry
        attach="geometry"
        args={[planeAspect.x, planeAspect.y, 1, 1]}
      />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
