import React, { useContext, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { ColyseusContext } from '../state/colyseus.context';
import { RoomComponent } from './room.component';
import { Client } from 'colyseus.js';

export const Room = () => {
  const { roomId } = useParams();
  const colyseusClient = useContext(ColyseusContext);

  useEffect(() => {
    (async () => {
      console.log('joining', roomId);
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await colyseusClient.joinById(roomId!);
      } catch (ex) {
        // likely room not found, make it
        await colyseusClient.create('trivia_jam', { roomId });
        // todo handle other errors
      }
      console.log('joined');
    })();
  }, [colyseusClient, roomId]);

  return <RoomComponent />;
};
