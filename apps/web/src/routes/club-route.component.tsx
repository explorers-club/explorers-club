import { useSelector } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { ClubScreen, selectLayoutMeta } from '../screens/club';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 20,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export const ClubRoute = () => {
  const actor = useClubScreenActor();
  const layoutMeta = useSelector(actor, selectLayoutMeta);

  const Footer = layoutMeta.footer;
  const snapPoints = layoutMeta.snapPoints || DEFAULT_SNAP_POINTS;
  const defaultSnap = layoutMeta.defaultSnap || DEFAULT_SNAP;

  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={defaultSnap}
      // snapPoints={({ minHeight }) => [minHeight + 24]}
      snapPoints={snapPoints}
      expandOnContentDrag={true}
      footer={Footer && <Footer />}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
