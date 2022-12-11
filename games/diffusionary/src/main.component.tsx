import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { MainContext } from './main.context';
import { MainMachine, mainMachine } from './main.machine';
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
  const state = useSelector(actor, (state) => state);

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

  // const myActor = useSelector(
  //   sharedCollectionActor,
  //   selectMyActor<DiffusionaryPlayerActor>
  // );

  // console.log({ myActor });

  // return <EnterNameScreen />;
  // What is it safe to assume here?
  // We can assume we have a shared collection actor,
  // we can assume we have a user id (if we're goign to have one)

  // So I think here we just need to render everything and call something out

  // const myActor = useSelector(
  //   sharedCollectionActor,
  //   selectMyActor<DiffusionaryPlayerActor>
  // );

  // const hasName = useSelector(myActor, (state) => state.context.playerName);
  // return <EnterNameScreen />;

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
