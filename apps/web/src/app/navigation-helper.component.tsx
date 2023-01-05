import { GameRoomId } from '@explorers-club/schema';
import { useContext, useEffect } from 'react';
import { AppContext } from '../state/app.context';

// Unrendered component that helps run navigation related
// business logic
export const NavigationHelper = () => {
  const { clubTabActor, gameTabActor, tabBarActor } = useContext(AppContext);

  useEffect(() => {
    clubTabActor.subscribe(({ context }) => {
      let currentGameRoomId: string;
      context.roomStore?.subscribe(({ gameRoomId }) => {
        if (gameRoomId && !currentGameRoomId) {
          currentGameRoomId = gameRoomId;
          gameTabActor.send({
            type: 'CONNECT',
            roomId: gameRoomId as GameRoomId,
          });
          tabBarActor.send({ type: 'NAVIGATE', tab: 'Game' });
        }
      });
    });
  }, [gameTabActor, clubTabActor, tabBarActor]);

  return null;
};
