import { selectSharedActor } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { MainContext } from '../main.context';
import { DiffusionarySharedActor } from '../state/diffusionary-shared.machine';
import { EnteringPromptScreen } from './entering-prompt-screen.container';
import { GuessingScreen } from './guessing-screen.container';

export const GameScreen = () => {
  const { sharedCollectionActor } = useContext(MainContext);

  const sharedActor = useSelector(
    sharedCollectionActor,
    selectSharedActor<DiffusionarySharedActor>
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const state = useSelector(sharedActor!, (state) => state);
  switch (true) {
    case state.matches('Playing.EnteringPrompt'): {
      return <EnteringPromptScreen />;
    }
    case state.matches('Playing.Guessing'): {
      return <GuessingScreen />;
    }
    default: {
      return null;
    }
  }
};
