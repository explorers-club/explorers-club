import { Flex } from '@atoms/Flex';
import { selectMyActor, SharedCollectionActor } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';
import { EnterNameScreen } from './screens/enter-name-screen.container';
import { DiffusionaryPlayerActor } from './state/diffusionary-player.machine';
import { DiffusionarySharedActor } from './state/diffusionary-shared.machine';

interface Props {
  sharedCollectionActor: SharedCollectionActor;
  sharedActor: DiffusionarySharedActor;
}

export const MainComponent: FC<Props> = ({
  sharedCollectionActor,
  sharedActor,
}) => {
  // What is it safe to assume here?
  // We can assume we have a shared collection actor,
  // we can assume we have a user id (if we're goign to have one)

  // So I think here we just need to render everything and call something out

  // const myActor = useSelector(
  //   sharedCollectionActor,
  //   selectMyActor<DiffusionaryPlayerActor>
  // );

  // const hasName = useSelector(myActor, (state) => state.context.playerName);
  return <EnterNameScreen />;

  // switch (true) {
  //   case nameRequired: {
  //     return <EnterNameScreen />;
  //   }
  //   default: {
  //     return null;
  //   }
  // }
  // const isStaging = useSelector(actor, selectIsStaging);
  // const isAwaitingQuestion = useSelector(actor, selectIsAwaitingQuestion);
  // const isOnQuestion = useSelector(actor, selectIsOnQuestion);
  // const isGameOver = useSelector(actor, selectIsGameOver);

  // switch (true) {
  //   case isStaging: {
  //     return <IntroductionScreen />;
  //   }
  //   case isAwaitingQuestion: {
  //     return <ScoreboardScreen />;
  //   }
  //   case isOnQuestion: {
  //     return <QuestionScreen />;
  //   }
  //   // case isGameOver: {
  //   //   return <GameEndScreen />;
  //   // }
  //   default: {
  //     return null;
  //   }
  // };
};
