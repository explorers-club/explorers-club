import { Sky } from '@react-three/drei';

export const SunsetSky = () => {
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
