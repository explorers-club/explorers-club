import {
  DiffusionaryState,
  HangoutState,
  TriviaJamState,
} from '@explorers-club/schema';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { Room as TRoom } from 'colyseus.js';
import { useParams } from 'react-router-dom';
import { HangoutRoom } from '../components/hangout-room';
import { ColyseusContext } from '../state/colyseus.context';

type RoomState = HangoutState | DiffusionaryState | TriviaJamState;

export const Room = () => {
  const { roomId } = useParams();
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery('room', async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const room = await colyseusClient.joinById<RoomState>(roomId!);
      return room;
    } catch (ex) {
      return await colyseusClient.create<RoomState>('hangout', { roomId });
    }
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
