import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useLayoutEffect, useRef, useState } from 'react';
import { InstancedMesh, Matrix4 } from 'three';
import { GLTF } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TreeModel } from '../tree';

const getRandomPosition = () => ({
  x: Math.random() * 100 - 50,
  z: Math.random() * 100 - 50,
});

const getTreePositions = (treeCount: number) => {
  return Array(treeCount)
    .fill(0)
    .map(() => {
      return { position: getRandomPosition() };
    });
};

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh;
    Icosphere: THREE.Mesh;
    Icosphere001: THREE.Mesh;
    Icosphere002: THREE.Mesh;
    Icosphere003: THREE.Mesh;
    Icosphere004: THREE.Mesh;
  };
  materials: {
    brown: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
  };
};

const numberOfNodes = 1000;

export const Forest = () => {
  const { nodes, materials } = useGLTF(
    './assets/tree.glb'
  ) as unknown as GLTFResult;

  // const model = useLoader(GLTFLoader, './assets/tree.glb');
  // const { nodes, materials } = useGLTF('./assets/tree.glb', true);
  const geo = nodes.Plane.geometry.clone();

  geo.computeVertexNormals();
  geo.scale(0.5, 0.5, 0.5);
  // const [trees] = useState(getTreePositions(100));

  const nodeData = Array.from({ length: numberOfNodes }, () => ({
    scale: 1,
    position: [50 * Math.random() - 25, 0, 50 * Math.random() - 25] as const,
  }));

  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const transform = new Matrix4();
    for (let i = 0; i < numberOfNodes; ++i) {
      transform.setPosition(...nodeData[i].position);
      ref.current?.setMatrixAt(i, transform);
    }
  }, [nodeData]);

  return (
    <instancedMesh ref={ref} args={[geo, undefined, numberOfNodes]}>
      <meshNormalMaterial attach="material" />
      {/* <meshBasicMaterial attach="material" color={'#0B0'} /> */}
      {/* <boxGeometry args={[0.8, 0.8, 0.8]}></boxGeometry> */}
      {/* <meshBasicMaterial attachArray="material" color={"#FCC"} />
      <meshBasicMaterial attachArray="material" color={"#D42A1F"} />
      <meshBasicMaterial attachArray="material" color={"#0B0"} />
      <meshBasicMaterial attachArray="material" color={"#D42A1F"} />
      <meshBasicMaterial attachArray="material" color={"#D42A1F"} />
      <meshBasicMaterial attachArray="material" color={"#D42A1F"} /> */}
    </instancedMesh>
  );

  return <TreeModel />;
};
