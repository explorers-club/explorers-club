import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { GlobalStateContext } from '../../state/global.provider';
import {
  selectFooterComponent,
  selectHeaderComponent,
} from '../../state/layout.selectors';
import { selectClubScreenActor } from '../../state/navigation.selectors';
import { ClubScreen } from './club-screen.container';

export const ClubRoute = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  const actor = useSelector(navigationActor, selectClubScreenActor);

  // const footer = useSelector(actor, selectFooterComponent);
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
      // header={header}
      // footer={footer}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
