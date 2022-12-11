import { useInterpret, useSelector } from '@xstate/react';
import { FC, useContext, useMemo } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { defaultSnapProps } from 'react-spring-bottom-sheet/dist/types';
import { MainContext } from './main.context';
import { MainActor, MainMachine, mainMachine } from './main.machine';
import { EnterNameScreen } from './screens/enter-name-screen.container';
import { GameScreen } from './screens/game-screen.container';

export const MainComponent = () => {
  const { sharedCollectionActor, userId } = useContext(MainContext);
  const machine = useMemo(() => {
    return mainMachine.withContext({
      sharedCollectionActor,
      userId,
    }) as MainMachine;
  }, [sharedCollectionActor, userId]);

  const actor = useInterpret(machine);

  return (
    <>
      <BottomSheet
        open={true}
        blocking={false}
        defaultSnap={({ snapPoints }: defaultSnapProps) => snapPoints[0]}
        snapPoints={({ minHeight }) => [minHeight]}
        // expandOnContentDrag={true}
        // footer={Footer && <Footer />}
        // header={header}
      >
        <MainUIComponent actor={actor} />
      </BottomSheet>
      <MainUIScene actor={actor} />
    </>
  );
};

interface MainUIProps {
  actor: MainActor;
}

const MainUIComponent: FC<MainUIProps> = ({ actor }) => {
  const state = useSelector(actor, (state) => state);
  console.log('main state', state);

  switch (true) {
    case state.matches('EnteringName'): {
      return <EnterNameScreen />;
    }
    case state.matches('Playing'): {
      return <GameScreen />;
    }
    default: {
      return null;
    }
  }
};

interface MainSceneProps {
  actor: MainActor;
}

const MainUIScene: FC<MainSceneProps> = ({ actor }) => {
  const state = useSelector(actor, (state) => state);
  // TODO 3D scene goes here..
  return null;
};
