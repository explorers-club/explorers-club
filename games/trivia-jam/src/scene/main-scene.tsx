// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@react-three/fiber';

export function MainScene() {
  return (
    <mesh position={[1, 2, 3]} rotation-x={0.5}>
      <boxGeometry />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}
