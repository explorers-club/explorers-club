import { ClubRoomId, ClubRoomIdSchema } from '@explorers-club/schema';
// import { matchMaker } from 'colyseus';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { Room as TRoom } from 'colyseus.js';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ClubRoom } from '../components/club-room';
import { GameRoom } from '../components/game-room';
import { ColyseusContext } from '../state/colyseus.context';

export const Room = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const roomPath = useParams()['roomId']!;
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery('club_room', async () => {
    let room: TRoom<ClubState>;
    const clubRooms = await colyseusClient.getAvailableRooms('club');

    const clubRoomIds = clubRooms.map((room) =>
      ClubRoomIdSchema.parse(room.roomId)
    );

    const clubRoomId: ClubRoomId = `club-${roomPath}`;

    if (clubRoomIds.includes(clubRoomId)) {
      const sessionId = localStorage.getItem(clubRoomId);

      if (sessionId) {
        try {
          room = await colyseusClient.reconnect(clubRoomId, sessionId);
        } catch (ex) {
          console.warn('error when trying to reconnect, joining normally', ex);
          room = await colyseusClient.joinById(clubRoomId);
        }
      } else {
        room = await colyseusClient.joinById(clubRoomId);
      }
    } else {
      room = await colyseusClient.create('club', {
        roomId: clubRoomId,
      });
    }

    room.onMessage('RESERVED_GAME_SEAT', ({ room, sessionId }) => {
      console.log('reserved', room.roomId);
      localStorage.setItem(room.roomId, sessionId);
    });

    localStorage.setItem(room.id, room.sessionId);
    return room;
  });
  const room = query.data;
  const [gameRoomId, setGameRoomId] = useState<string | undefined>(
    room?.state.gameRoomId
  );

  useEffect(() => {
    room?.state.listen('gameRoomId', setGameRoomId);
  }, [room]);

  if (!room) {
    // todo placeholder
    return null;
  }

  if (gameRoomId) {
    return <GameRoom roomId={gameRoomId} clubRoom={room} />;
  } else {
    return <ClubRoom room={room} />;
  }
};
