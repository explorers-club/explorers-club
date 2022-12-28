import {
  ClubStore,
  createRoomStore,
  useStoreSelector,
} from '@explorers-club/room';
import { ClubRoomId, ClubRoomIdSchema } from '@explorers-club/schema';
// import { matchMaker } from 'colyseus';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { Room as TRoom } from 'colyseus.js';
import { FC, useContext } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ClubRoom } from '../components/club-room';
import { GameRoom } from '../components/game-room';
import { AuthContext } from '../state/auth.context';
import { ColyseusContext } from '../state/colyseus.context';

export const Room = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clubName = useParams()['clubName']!;
  const colyseusClient = useContext(ColyseusContext);
  const { userId } = useContext(AuthContext);

  // TODO prevent reconnects
  const query = useQuery('club_room', async () => {
    let room: TRoom<ClubState>;
    const clubRooms = await colyseusClient.getAvailableRooms('club');

    const clubRoomIds = clubRooms.map((room) =>
      ClubRoomIdSchema.parse(room.roomId)
    );

    const clubRoomId: ClubRoomId = `club-${clubName}`;

    if (clubRoomIds.includes(clubRoomId)) {
      const sessionId = localStorage.getItem(clubRoomId);

      if (sessionId) {
        try {
          room = await colyseusClient.reconnect(clubRoomId, sessionId);
        } catch (ex) {
          console.warn(
            `error when trying to reconnect with ${sessionId} on ${clubRoomId}, joining normally`,
            ex
          );
          // todo pass up auth tokens instead of user ids
          room = await colyseusClient.joinById(clubRoomId, { userId });
        }
      } else {
        room = await colyseusClient.joinById(clubRoomId, { userId });
      }
    } else {
      room = await colyseusClient.create('club', {
        roomId: clubRoomId,
        userId,
      });
    }

    room.onMessage('RESERVED_GAME_SEAT', ({ room, sessionId }) => {
      localStorage.setItem(room.roomId, sessionId);
    });

    localStorage.setItem(room.id, room.sessionId);

    const store = createRoomStore(room);

    // wait until the room has synced before returning
    await new Promise((resolve) => room.onStateChange.once(resolve));

    return store;
  });
  const store = query.data;

  if (!store) {
    return null;
  }

  return <RoomComponent store={store} />;
};

interface Props {
  store: ClubStore;
}

const RoomComponent: FC<Props> = ({ store }) => {
  const gameRoomId = useStoreSelector(store, (state) => state.gameRoomId);

  if (gameRoomId) {
    return <GameRoom clubStore={store} />;
  } else {
    return <ClubRoom store={store} />;
  }
};
