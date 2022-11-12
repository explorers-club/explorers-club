import { BottomSheet } from 'react-spring-bottom-sheet';
import { HomeScreen } from './home-screen.container';
import { useHomeScreenActor } from './home-screen.hooks';

export const HomeRoute = () => {
  const actor = useHomeScreenActor();
  //   const footer = useSelector(actor, selectFooterComponent);
  //   const header = useSelector(actor, selectHeaderComponent);

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
      <HomeScreen />
    </BottomSheet>
  );
};
