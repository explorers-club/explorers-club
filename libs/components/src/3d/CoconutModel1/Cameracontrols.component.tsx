import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  cameraModes,
  useCharacterCustomization,
} from './Customization-context.component';
import * as THREE from 'three';
import { useRef } from 'react';
import { customizationStateTypes } from './character.types';

const cameraPositions = {
  [cameraModes.HEAD]: {
    position: new THREE.Vector3(-0.2, 1.2, 2),
    target: new THREE.Vector3(0, 1, 0),
  },
  [cameraModes.TOP]: {
    position: new THREE.Vector3(-0.8, 1, 2),
    target: new THREE.Vector3(0, 1, 0),
  },
  [cameraModes.BOTTOM]: {
    position: new THREE.Vector3(0, 0.5, 1.5),
    target: new THREE.Vector3(0, 0.5, 0),
  },
};

export const CameraControls = () => {
  const { cameraMode } = useCharacterCustomization() as customizationStateTypes;
  const orbitControls = useRef<any>();

  useFrame((state, delta) => {
    if (cameraMode === cameraModes.FREE) {
      return;
    }
    state.camera.position.lerp(cameraPositions[cameraMode].position, 3 * delta);
    orbitControls.current.target.lerp(
      cameraPositions[cameraMode].target,
      3 * delta
    );
  });

  return (
    <>
      <OrbitControls
        ref={orbitControls}
        enableRotate={cameraMode !== cameraModes.HEAD}
      />
    </>
  );
};
