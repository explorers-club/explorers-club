import { Plane, Sky } from '@react-three/drei';
import { Meta } from '@storybook/react';
import { CanvasSetup } from '../../.storybook/CanvasSetup';

export default {
  component: Sky,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

function SkyScene() {
  return (
    <>
      <Sky
        distance={3000}
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49}
        azimuth={0.25}
      />
      <Plane rotation-x={Math.PI / 2} args={[100, 100, 4, 4]}>
        <meshBasicMaterial color="black" wireframe />
      </Plane>
      <axesHelper />
    </>
  );
}

export const SkySt = () => <SkyScene />;
SkySt.storyName = 'Default';

// function SkyScene2() {
//   return (
//     <>
//       <Sky
//         distance={3000}
//         turbidity={number('Turbidity', 8, { range: true, max: 10, step: 0.1 })}
//         rayleigh={number('Rayleigh', 6, { range: true, max: 10, step: 0.1 })}
//         mieCoefficient={number('mieCoefficient', 0.005, {
//           range: true,
//           max: 0.1,
//           step: 0.001,
//         })}
//         mieDirectionalG={number('mieDirectionalG', 0.8, {
//           range: true,
//           max: 1,
//           step: 0.01,
//         })}
//         inclination={number('Inclination', 0.49, {
//           range: true,
//           max: 1,
//           step: 0.01,
//         })}
//         azimuth={number('Azimuth', 0.25, { range: true, max: 1, step: 0.01 })}
//       />
//       <Plane rotation-x={Math.PI / 2} args={[100, 100, 4, 4]}>
//         <meshBasicMaterial color="black" wireframe />
//       </Plane>
//       <axesHelper />
//     </>
//   );
// }

// export const SkySt2 = () => <SkyScene2 />;
// SkySt2.storyName = 'Custom angles';

// function SkyScene3() {
//   // NOT the right way to do it...
//   const [inclination, setInclination] = React.useState(0);
//   useFrame(() => {
//     setInclination((a) => a + 0.002);
//   });

//   return (
//     <>
//       <Sky
//         distance={3000}
//         turbidity={number('Turbidity', 8, { range: true, max: 10, step: 0.1 })}
//         rayleigh={number('Rayleigh', 6, { range: true, max: 10, step: 0.1 })}
//         mieCoefficient={number('mieCoefficient', 0.005, {
//           range: true,
//           max: 0.1,
//           step: 0.001,
//         })}
//         mieDirectionalG={number('mieDirectionalG', 0.8, {
//           range: true,
//           max: 1,
//           step: 0.01,
//         })}
//         inclination={inclination}
//         azimuth={number('Azimuth', 0.25, { range: true, max: 1, step: 0.01 })}
//       />
//       <Plane rotation-x={Math.PI / 2} args={[100, 100, 4, 4]}>
//         <meshBasicMaterial color="black" wireframe />
//       </Plane>
//       <axesHelper />
//     </>
//   );
// }

// export const SkySt3 = () => <SkyScene3 />;
// SkySt3.storyName = 'Rotation';
