import { useSelector } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { selectFooterComponent } from '../../state/layout.selectors';
import { ClubScreen } from './club-screen.container';
import { useClubScreenActor } from './club-screen.hooks';

export const ClubRoute = () => {
  const actor = useClubScreenActor();

  const Footer = useSelector(actor, selectFooterComponent);
  // const header = useSelector(actor, selectHeaderComponent);

  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={({ maxHeight }) => maxHeight / 2}
      snapPoints={({ maxHeight }) => [
        maxHeight - maxHeight / 10,
        maxHeight / 4,
        maxHeight * 0.6,
      ]}
      expandOnContentDrag={true}
      footer={Footer && <Footer />}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
