import { GameRoomId } from '@explorers-club/schema';
import { useContext, useEffect } from 'react';
import { AppContext } from '../state/app.context';

// Unrendered component that helps run navigation related
// business logic
export const NavigationHelper = () => {
  const { clubTabActor, gameTabActor, tabBarActor } = useContext(AppContext);

  useEffect(() => {
    clubTabActor.subscribe(({ context }) => {
      let currentGameRoomId: string | null;

      context.store?.subscribe(({ gameRoomIds }) => {
        // If the game room was removed, disconnect the game
        if (currentGameRoomId && !gameRoomIds.includes(currentGameRoomId)) {
          tabBarActor.send({ type: 'NAVIGATE', tab: 'Club' });
          gameTabActor.send({
            type: 'LEAVE',
          });
          currentGameRoomId = null;
        } else if (gameRoomIds[0] && !currentGameRoomId) {
          const roomId = gameRoomIds[0] as GameRoomId;
          currentGameRoomId = roomId;
          gameTabActor.send({
            type: 'CONNECT',
            roomId,
          });
          tabBarActor.send({ type: 'NAVIGATE', tab: 'Game' });
        }
      });
    });
  }, [gameTabActor, clubTabActor, tabBarActor]);

  return null;
};
