import { Grid } from '@react-three/drei';

export const Floor = () => {
  return (
    <Grid
      cellColor="#444"
      sectionColor="#444"
      fadeDistance={400}
      fadeStrength={10}
      infiniteGrid={true}
      matrixWorldAutoUpdate={undefined}
      getObjectsByProperty={undefined}
      getVertexPosition={undefined}
    />
    // <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
    //   <planeGeometry args={[30, 50]} />
    //   <meshBasicMaterial color="#000" side={DoubleSide} />
    // </mesh>
  );
};
