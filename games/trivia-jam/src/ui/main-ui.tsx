import { FC } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { GameContext } from '../state/game.context';
import { selectFooterProps, TriviaJamActor } from '../state';
import { Screens } from '../screens';
import { useSelector } from '@xstate/react';

interface Props {
  gameActor: TriviaJamActor;
}

export const TriviaJamMainUI: FC<Props> = ({ gameActor }) => {
  const footerProps = useSelector(gameActor, selectFooterProps);
  // useEffect(() => {
  //   contentfulClient.getEntry('6THg9TlFzbKerSDrniPxL0').then((f) => {
  //     console.log({ f });
  //   });
  // }, []);

  return (
    <GameContext.Provider value={{ gameActor }}>
      <BottomSheet
        open={true}
        blocking={false}
        defaultSnap={defaultSnap}
        // snapPoints={({ minHeight }) => [minHeight + 24]}
        snapPoints={snapPoints}
        expandOnContentDrag={true}
        footer={Footer && <Footer />}
        // header={header}
      >
        <Screens />
      </BottomSheet>
    </GameContext.Provider>
  );
};

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 20,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];
