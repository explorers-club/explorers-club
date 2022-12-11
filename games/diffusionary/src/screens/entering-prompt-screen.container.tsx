import { selectMyActor, selectSharedActor } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import React, { useCallback, useContext } from 'react';
import { MainContext } from '../main.context';
import {
  DiffusionaryPlayerActor,
  DiffusionaryPlayerEvents,
} from '../state/diffusionary-player.machine';
import { DiffusionarySharedActor } from '../state/diffusionary-shared.machine';
import { EnteringPromptScreenComponent } from './entering-prompt-screen.component';

export const EnteringPromptScreen = () => {
  const { sharedCollectionActor, userId } = useContext(MainContext);
  const sharedActor = useSelector(
    sharedCollectionActor,
    selectSharedActor<DiffusionarySharedActor>
  );
  const isMyTurn = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sharedActor!,
    (state) => state.context.currentPlayer === userId
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const myActor = useSelector(
    sharedCollectionActor,
    selectMyActor<DiffusionaryPlayerActor>
  )!;

  const handleSubmitPrompt: (prompt: string) => void = useCallback(
    (prompt) => {
      myActor.send(DiffusionaryPlayerEvents.ENTER_PROMPT(prompt));
    },
    [myActor]
  );

  return (
    isMyTurn && (
      <EnteringPromptScreenComponent onSubmitPrompt={handleSubmitPrompt} />
    )
  );
};
