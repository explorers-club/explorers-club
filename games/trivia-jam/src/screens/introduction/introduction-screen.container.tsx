import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { useMyActor } from '../../state/game.hooks';
import {
  TriviaJamPlayerActor,
  TriviaJamPlayerEvents,
} from '../../state/trivia-jam-player.machine';
import { selectPlayerName } from '../../state/trivia-jam-player.selectors';
import { IntroductionScreenComponent } from './introduction-screen.component';

export const IntroductionScreen = () => {
  const myActor = useMyActor();

  if (!myActor) {
    return null;
  }

  return <IntroductionScreenForPlayer myActor={myActor} />;
};

const IntroductionScreenForPlayer = ({
  myActor,
}: {
  myActor: TriviaJamPlayerActor;
}) => {
  // const sharedCollectionActor = useSharedCollectionActor();

  const playerName = useSelector(myActor, selectPlayerName);

  const handleCompleteIntro = useCallback(() => {
    myActor.send(TriviaJamPlayerEvents.CONTINUE());
  }, [myActor]);

  return (
    <IntroductionScreenComponent
      playerName={playerName}
      onCompleteIntro={handleCompleteIntro}
    />
  );
};
