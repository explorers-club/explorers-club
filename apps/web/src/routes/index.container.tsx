import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { ColyseusContext } from '../state/colyseus.context';
import { IndexComponent } from './index.component';

export const Index = () => {
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery(
    'rooms',
    async () => {
      return colyseusClient.getAvailableRooms('club');
    },
    {
      refetchOnWindowFocus: true,
      refetchInterval: 20000,
    }
  );

  if (!query.data) {
    return null;
  }

  return <IndexComponent rooms={query.data} />;
};
