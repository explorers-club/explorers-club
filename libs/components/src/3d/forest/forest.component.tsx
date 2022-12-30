import { useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Tree } from '../tree';

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

export const Forest = () => {
  const model = useLoader(GLTFLoader, './assets/palm_tree.glb');
  const [trees] = useState(getTreePositions(100));

  //   return <Tree />;
  return (
    //     <object3D position={[0, 0, 0]}>
    //       <primitive object={model.scene} />
    //     </object3D>
    <group>
      {trees.map(({ position }, index) => {
        console.log(position);
        return (
          <object3D key={index} position={[position.x, 0, position.z]}>
            <primitive object={model.scene.clone()} />
          </object3D>
        );
      })}
    </group>
  );

  return <Tree />;
};
