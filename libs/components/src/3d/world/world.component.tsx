import { FC } from 'react';
import ThreeGlobe from 'three-globe';

interface Props {
  globe: ThreeGlobe;
}

export const World: FC<Props> = ({ globe }) => {
  return <primitive object={globe} />;
};
