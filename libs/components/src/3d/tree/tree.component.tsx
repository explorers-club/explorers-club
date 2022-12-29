import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    pine_3003: THREE.Mesh;
  };
  materials: {
    pine_final: THREE.MeshStandardMaterial;
  };
};

export function Tree(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    './assets/tree.glb'
  ) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pine_3003.geometry}
        material={materials.pine_final}
      />
    </group>
  );
}

useGLTF.preload('./assets/tree.glb');
