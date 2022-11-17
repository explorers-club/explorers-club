import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps
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

  // TODO move this in to a sub component to prevent re-renders
  // if we need to change the button state (i.e. disable/enable)
  // const handlePressFooter = useCallback(() => {
  //   if (!footerProps || !footerProps.visible) {
  //     return;
  //   }

  //   actor.send(ClubScreenEvents.PRESS_PRIMARY());
  // }, [actor, footerProps]);

  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={DEFAULT_SNAP}
      // snapPoints={({ minHeight }) => [minHeight + 24]}
      snapPoints={DEFAULT_SNAP_POINTS}
      expandOnContentDrag={true}
      // footer={
      //   footerProps?.visible ? (
      //     <Button onClick={handlePressFooter}>{footerProps.label}</Button>
      //   ) : null
      // }
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};