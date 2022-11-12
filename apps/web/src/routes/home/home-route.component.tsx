import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useActorLogger } from '../../lib/logging';
import { HomeScreen } from '../../screens/home';
import { GlobalStateContext } from '../../state/global.provider';
import { selectFooterComponent } from '../../state/layout.selectors';
import { selectHomeScreenActor } from '../../state/navigation.selectors';

export const HomeRoute = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  const actor = useSelector(navigationActor, selectHomeScreenActor);
  const Footer = useSelector(actor, selectFooterComponent);

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
      footer={Footer && <Footer />}
    >
      <HomeScreen />
    </BottomSheet>
  );
};
