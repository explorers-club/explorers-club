import { createRoomStore } from '@explorers-club/room';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { FC, useContext } from 'react';
import { useQuery } from 'react-query';
import { AuthContext } from '../../state/auth.context';
import { ColyseusContext } from '../../state/colyseus.context';
import { ClubStore } from '../../type';

interface Props {
  clubStore: ClubStore;
}

export const GameRoom: FC<Props> = ({ clubStore }) => {
  const colyseusClient = useContext(ColyseusContext);
  const { userId } = useContext(AuthContext);

  const query = useQuery('game_room', async () => {
    const { gameRoomId } = clubStore.getSnapshot();

    const room = await colyseusClient.joinById<TriviaJamState>(gameRoomId, {
      userId,
    });

    return { type: 'trivia_jam', store: createRoomStore(room) };
  });

  const store = query.data?.store;
  if (!store) {
    return null;
  }
  // const;

  switch (query.data?.type) {
    // case 'diffusionary':
    //   return <DiffusionaryRoom store={store} />;
    case 'trivia_jam':
      return <TriviaJamRoom store={store} myUserId={userId} />;
    default:
      return null;
  }
};
