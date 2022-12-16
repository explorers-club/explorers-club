import {
  DiffusionaryState,
  HangoutState,
  TriviaJamState,
} from '@explorers-club/schema';
// import { matchMaker } from 'colyseus';
import { Room as TRoom } from 'colyseus.js';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { HangoutRoom } from '../components/hangout-room';
import { ColyseusContext } from '../state/colyseus.context';

type RoomState = HangoutState | DiffusionaryState | TriviaJamState;

export const Room = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const roomId = useParams()['roomId']!;

  const colyseusClient = useContext(ColyseusContext);
  // todo we need to clear the sessions somehow
  const [sessionId, setSessionId] = useLocalStorage<string | null>(
    `sessionId-${roomId}`,
    null
  );

  const query = useQuery('room', async () => {
    let room: TRoom<RoomState>;
    const rooms = await colyseusClient.getAvailableRooms('hangout');
    const existingRoomIds = rooms.map((room) => room.roomId);

    if (existingRoomIds.includes(roomId)) {
      if (sessionId) {
        room = await colyseusClient.reconnect(roomId, sessionId);
      } else {
        room = await colyseusClient.joinById(roomId);
      }
    } else {
      room = await colyseusClient.create('hangout', {
        roomId,
      });
    }

    setSessionId(room.sessionId);
    return room;
  });
  const room = query.data;

  if (!room) {
    // todo placeholder
    return null;
  }

  switch (room.name) {
    case 'hangout':
      return <HangoutRoom room={room as TRoom<HangoutState>} />;
    default:
      return null;
  }
};
