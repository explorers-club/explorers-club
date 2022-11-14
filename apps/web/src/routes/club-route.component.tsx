import { useSelector } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ClubScreen, selectFooterComponent } from '../screens/club';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';

export const ClubRoute = () => {
  // const { navigationActor } = useContext(GlobalStateContext);
  // const actor = useSelector(navigationActor, selectClubScreenActor);
  const actor = useClubScreenActor();
  const Footer = useSelector(actor, selectFooterComponent);

  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      // snapPoints={({ minHeight }) => [minHeight + 24]}
      snapPoints={({ footerHeight, maxHeight }) => [
        footerHeight + 20,
        maxHeight * 0.6,
        maxHeight * 0.9,
      ]}
      expandOnContentDrag={true}
      footer={Footer && <Footer />}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
