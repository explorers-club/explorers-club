import React, { FC, useContext } from 'react';
import { Room as TRoom } from 'colyseus.js';
import { useQuery } from 'react-query';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';
import { ColyseusContext } from '../../state/colyseus.context';

interface Props {
  roomId: string;
}

export const GameRoom: FC<Props> = ({ roomId }) => {
  const colyseusClient = useContext(ColyseusContext);
  const query = useQuery('game_room', async () => {
    return await colyseusClient.joinById(roomId);
  });
  const room = query.data;

  switch (room?.name) {
    case 'diffusionary':
      return <DiffusionaryRoom room={room as TRoom<DiffusionaryState>} />;
    case 'trivia_jam':
      return <TriviaJamRoom room={room as TRoom<TriviaJamState>} />;
    default:
      return null;
  }
};
