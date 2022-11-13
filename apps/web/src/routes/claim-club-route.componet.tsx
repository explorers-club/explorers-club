import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ClaimClubScreen, ClaimClubScreenActor } from '../screens/claim-club';
import { ClaimClubContext } from '../screens/claim-club/claim-club.context';
import { GlobalStateContext } from '../state/global.provider';

export const ClaimClubRoute = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  const actor = useSelector(navigationActor, (state) => {
    return state.children['claimClubScreenMachine'] as
      | ClaimClubScreenActor
      | undefined;
  });
  if (!actor) {
    // unexpected, todo: something else here
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

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
      <ClaimClubContext.Provider value={{ actor }}>
        <ClaimClubScreen />
      </ClaimClubContext.Provider>
    </BottomSheet>
  );
};
