import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ColyseusContext } from '../state/colyseus.context';
import { RoomComponent } from './room.component';

export const Room = () => {
  const { roomId } = useParams();
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery('room', async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return await colyseusClient.joinById(roomId!);
    } catch (ex) {
      return await colyseusClient.create('hangout', { roomId });
    }
  });

  return <RoomComponent room={query.data} />;
};
