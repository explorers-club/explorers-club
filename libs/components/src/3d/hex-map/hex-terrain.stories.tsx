import { Meta, Story } from '@storybook/react';
import { latLngToCell } from 'h3-js';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { useHexagonScatterAtIndex } from './hex-map.hooks';
import { HexTerrain } from './hex-terrain.component';

export default {
  component: HexTerrain,
  decorators: [withCanvasSetup],
} as Meta;

const testLat = 37.839999;
const testLng = -122.23032;

const Template: Story<{ h3Index: string; lod: number }> = (args) => {
  const points = useHexagonScatterAtIndex(args.h3Index, args.lod);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <HexTerrain points={points} h3Index={args.h3Index} lod={args.lod} />
    </group>
  );
};

export const Res5 = Template.bind({});
Res5.args = {
  h3Index: latLngToCell(testLat, testLng, 5),
  lod: 1,
};

export const Res8 = Template.bind({});
Res8.args = {
  h3Index: latLngToCell(testLat, testLng, 8),
  lod: 2,
};

export const Res10 = Template.bind({});
Res10.args = {
  h3Index: latLngToCell(testLat, testLng, 10),
  lod: 2,
};

export const Res11 = Template.bind({});
Res11.args = {
  h3Index: latLngToCell(testLat, testLng, 11),
  lod: 3,
};

export const Res13 = Template.bind({});
Res13.args = {
  h3Index: latLngToCell(testLat, testLng, 13),
  lod: 2,
};
