import { BottomSheet } from 'react-spring-bottom-sheet';
import { ClubScreen } from '../screens/club';

export const ClubRoute = () => {
  // const { navigationActor } = useContext(GlobalStateContext);
  // const actor = useSelector(navigationActor, selectClubScreenActor);
  // const Footer = useSelector(actor, selectFooterComponent);

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
      // footer={Footer && <Footer />}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
