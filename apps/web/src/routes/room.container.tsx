import {
  ClubRoomIdSchema,
  DiffusionaryRoomIdSchema,
  RoomId,
  TriviaJamRoomIdSchema,
} from '@explorers-club/schema';
// import { matchMaker } from 'colyseus';
import { Room as TRoom } from 'colyseus.js';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ClubRoom } from '../components/club-room';
import { ColyseusContext } from '../state/colyseus.context';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';

type RoomState = ClubState | DiffusionaryState | TriviaJamState;

export const Room = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const roomPath = useParams()['roomId']!;
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery('room', async () => {
    let room: TRoom<RoomState>;
    // What's the point of all the shit i just did really
    // we need to be able to transition a user out of a room... how does that happen?
    // well we need to manage multiple rooms then i guess, that sounds complicated.
    // how about we just switch rooms.
    // we'll use a global context
    const [clubRooms, triviaJamRooms, diffusionaryRooms] = await Promise.all([
      colyseusClient.getAvailableRooms('club'),
      colyseusClient.getAvailableRooms('trivia_jam'),
      colyseusClient.getAvailableRooms('diffusionary'),
    ]);

    const clubRoomIds = clubRooms.map((room) =>
      ClubRoomIdSchema.parse(room.roomId)
    );
    const triviaJamRoomIds = triviaJamRooms.map((room) =>
      TriviaJamRoomIdSchema.parse(room.roomId)
    );
    const diffusionaryRoomIds = diffusionaryRooms.map((room) =>
      DiffusionaryRoomIdSchema.parse(room.roomId)
    );

    let existingRoomId: RoomId | undefined;
    if (diffusionaryRoomIds.includes(`diffusionary-${roomPath}`)) {
      existingRoomId = `diffusionary-${roomPath}`;
    } else if (triviaJamRoomIds.includes(`trivia_jam-${roomPath}`)) {
      existingRoomId = `trivia_jam-${roomPath}`;
    } else if (clubRoomIds.includes(`club-${roomPath}`)) {
      existingRoomId = `club-${roomPath}`;
    }

    const sessionId = existingRoomId
      ? localStorage.getItem(existingRoomId)
      : null;

    if (existingRoomId) {
      if (sessionId) {
        room = await colyseusClient.reconnect(existingRoomId, sessionId);
      } else {
        room = await colyseusClient.joinById(existingRoomId);
      }
    } else {
      room = await colyseusClient.create('club', {
        roomId: `club-${roomPath}`,
      });
    }

    localStorage.setItem(room.id, room.sessionId);
    return room;
  });
  const room = query.data;

  if (!room) {
    // todo placeholder
    return null;
  }

  switch (room.name) {
    case 'club':
      return <ClubRoom room={room as TRoom<ClubState>} />;
    case 'diffusionary':
      return <DiffusionaryRoom room={room as TRoom<DiffusionaryState>} />;
    case 'trivia_jam':
      return <TriviaJamRoom room={room as TRoom<TriviaJamState>} />;
    default:
      return null;
  }
};
