import { Button } from '@atoms/Button';
import { selectFooterProps } from '@explorers-club/trivia-jam/state';
import { useSelector } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { ClubScreen } from '../screens/club';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 20,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export const ClubRoute = () => {
  const actor = useClubScreenActor();
  const footerProps = useSelector(actor, selectFooterProps);

  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={DEFAULT_SNAP}
      // snapPoints={({ minHeight }) => [minHeight + 24]}
      snapPoints={DEFAULT_SNAP_POINTS}
      expandOnContentDrag={true}
      footer={footerProps.visible ? <Button>{footerProps.label}</Button> : null}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
