import { FC, useMemo } from 'react';
import ThreeGlobe from 'three-globe';
import { countries } from './__stories/countries';

interface Props {
  globeImageUrl: string;
}

export const World: FC<Props> = ({ globeImageUrl }) => {
  const globe = useMemo(() => {
    const globe = new ThreeGlobe();
    // globe.globeImageUrl(globeImageUrl);
    globe.hexPolygonsData(countries.features);
    globe.hexPolygonResolution(3);
    globe.hexPolygonMargin(0.5);
    globe.hexPolygonColor(
      () =>
        `#${Math.round(Math.random() * Math.pow(2, 24))
          .toString(16)
          .padStart(6, '0')}`
    );
    return globe;
  }, [globeImageUrl]);
  return <primitive object={globe} />;
};
