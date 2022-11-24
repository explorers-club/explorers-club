import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  SnapPointProps,
  defaultSnapProps,
} from 'react-spring-bottom-sheet/dist/types';
import { HomeScreen } from '../screens/home';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.2,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export const HomeRoute = () => {
  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={DEFAULT_SNAP}
      snapPoints={DEFAULT_SNAP_POINTS}
      expandOnContentDrag={true}
    >
      <HomeScreen />
    </BottomSheet>
  );
};
