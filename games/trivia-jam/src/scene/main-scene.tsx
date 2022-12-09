import { Sky } from '@react-three/drei';
import { DoubleSide } from 'three';
import { Treehouse } from './treehouse.component';

export function MainScene() {
  return (
    <>
      <Treehouse rotation={[0, -Math.PI / 3, 0]} />
      <Floor />
      <SunsetSky />
    </>
  );
}

const Floor = () => {
  return (
    <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 50]} />
      <meshBasicMaterial color="#000" side={DoubleSide} />
    </mesh>
  );
};

const SunsetSky = () => {
  return (
    <Sky
      distance={3000}
      turbidity={8}
      rayleigh={6}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
      inclination={0.49}
      azimuth={0.25}
    />
  );
};

// const Trees = () => {
//   const geometry = useMemo(() => {
//     const baseGeometry = new THREE.ConeGeometry(10, 40, 32);
//     const geometries = [];
//     for (let x = -500; x < 500; x += 73) {
//       for (let y = -500; y < 500; y += 56) {
//         const geometry = baseGeometry.clone();
//         geometry.translate(x, 0, y);
//         geometries.push(geometry);
//       }
//     }
//     return mergeBufferGeometries(geometries);
//   }, []);

//   if (!geometry) {
//     return null;
//   }

//   return (
//     <mesh geometry={geometry}>
//       <meshBasicMaterial color="#141b17" />
//     </mesh>
//   );
// };
