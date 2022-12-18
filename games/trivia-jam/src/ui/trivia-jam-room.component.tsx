import React, { useContext, useEffect } from 'react';
import { Flex } from '@atoms/Flex';
import { TriviaJamRoomContext } from './trivia-jam-room.context';
import { useSelector } from '@xstate/react';
import { PlayScreen } from './play-screen.container';
import { IntroductionScreen } from './introduction-screen.container';
import { SummaryScreen } from './summary-screen.container';

export const TriviaJamRoomComponent = () => {
  const service = useContext(TriviaJamRoomContext);
  const state = useSelector(service, (state) => state);

  // useEffect(() => {
  //   const room = service.getSnapshot()?.context.room;
  //   if (!room) {
  //     return;
  //   }
  //   room.state.listen("players", setPlayers)

  // }, [service])

  switch (true) {
    // case state.matches('EnteringName'):
    //   return <EnterNameScreen />;
    case state.matches('Initializing'):
      return <IntroductionScreen />;
    case state.matches('Playing'):
      return <PlayScreen />;
    case state.matches('GameOver'):
      return <SummaryScreen />;
    default:
      return null;
  }
};
