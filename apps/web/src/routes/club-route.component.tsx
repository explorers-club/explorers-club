import { ReactNode, useContext, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { ClubScreen } from '../screens/club';
import { FooterContext } from '../state/footer.context';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export const ClubRoute = () => {
  // const actor = useClubScreenActor();
  // const state = useSelector(actor, (state) => state);
  // console.log({ actor, state });

  const [FooterComponent, setFooterComponent] = useState<ReactNode>(undefined);

  return (
    <FooterContext.Provider value={{ FooterComponent, setFooterComponent }}>
      <ClubRouteComponent />
    </FooterContext.Provider>
  );
};

const ClubRouteComponent = () => {
  const { FooterComponent } = useContext(FooterContext);
  console.log('club route render', FooterComponent);
  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={DEFAULT_SNAP}
      // snapPoints={({ minHeight }) => [minHeight + 24]}
      snapPoints={DEFAULT_SNAP_POINTS}
      expandOnContentDrag={true}
      footer={FooterComponent}
      // header={header}
    >
      <ClubScreen />
    </BottomSheet>
  );
};
