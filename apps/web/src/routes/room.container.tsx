import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { RoomComponent } from './room.component';
import * as Colyseus from 'colyseus.js';

const COLYSEUS_HOST_URL = 'ws://localhost:2567';

export const Room = () => {
  const { roomId } = useParams();

  const client = useMemo(() => new Colyseus.Client(COLYSEUS_HOST_URL), []);

  useEffect(() => {
    (async () => {
      console.log('joining');
      await client.joinOrCreate('trivia_jam', { roomId });
      console.log('joined');
    })();
  }, [client, roomId]);

  return <RoomComponent />;
};
