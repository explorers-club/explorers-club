import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { useRef, useState, RefObject, useCallback } from 'react';
import * as THREE from 'three';

interface BackgroundProps {
  url: string;
}

const Background: React.FC<BackgroundProps> = ({ url }) => {
  const texture = useLoader(THREE.TextureLoader, url);
  const { width, height } = texture.image;
  const aspectRatio = width / height;

  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[2 * aspectRatio, 2]} />
      <shaderMaterial
        attach="material"
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
          uAmplitude: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform float uAmplitude;
          varying vec2 vUv;

          void main() {
            vec2 distortedUv = vUv + vec2(
              cos(vUv.y * 10.0 + uTime) * uAmplitude,
              sin(vUv.x * 10.0 + uTime) * uAmplitude
            );
            gl_FragColor = texture2D(uTexture, distortedUv);
          }
        `}
      />
      <orthographicCamera
        attach="camera"
        position={[0, 0, 1]}
        left={-aspectRatio}
        right={aspectRatio}
        top={1}
        bottom={-1}
        near={0.1}
        far={10}
      />
    </mesh>
  );
};

export default Background;
