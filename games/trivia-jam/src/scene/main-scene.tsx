// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Environment } from '@react-three/drei';
import * as _ from '@react-three/fiber';
import { DoubleSide } from 'three';
import { Treehouse } from './treehouse.component';

export function MainScene() {
  return (
    <>
      <Environment preset={'forest'} background={true} />
      <Treehouse />
      <Floor />
    </>
  );
}

const Floor = () => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial color="#4c2921" side={DoubleSide} />
    </mesh>
  );
};
