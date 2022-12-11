import { selectSharedActor } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import React, { useContext } from 'react';
import { MainContext } from '../main.context';
import { DiffusionarySharedActor } from '../state/diffusionary-shared.machine';
import { EnteringPromptScreenComponent } from './entering-prompt-screen.component';

export const EnteringPromptScreen = () => {
  const { sharedCollectionActor, userId } = useContext(MainContext);
  const sharedActor = useSelector(
    sharedCollectionActor,
    selectSharedActor<DiffusionarySharedActor>
  );
  const isMyTurn = useSelector(
    sharedActor!,
    (state) => state.context.currentPlayer === userId
  );

  return isMyTurn && <EnteringPromptScreenComponent />;
};
