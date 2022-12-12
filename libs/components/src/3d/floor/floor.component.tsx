import { DoubleSide } from 'three';

export const Floor = () => {
  return (
    <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 50]} />
      <meshBasicMaterial color="#000" side={DoubleSide} />
    </mesh>
  );
};
