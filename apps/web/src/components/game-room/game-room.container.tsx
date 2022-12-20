import React, { FC, useContext } from 'react';
import { Room, Room as TRoom } from 'colyseus.js';
import { useQuery } from 'react-query';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';
import { ColyseusContext } from '../../state/colyseus.context';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { AuthContext } from '../../state/auth.context';

interface Props {
  roomId: string;
  clubRoom: Room<ClubState>;
}

export const GameRoom: FC<Props> = ({ roomId, clubRoom }) => {
  const colyseusClient = useContext(ColyseusContext);
  const { userId } = useContext(AuthContext);

  const query = useQuery('game_room', async () => {
    return await colyseusClient.joinById(roomId, {
      userId,
    });
  });
  const room = query.data;

  switch (room?.name) {
    case 'diffusionary':
      return <DiffusionaryRoom room={room as TRoom<DiffusionaryState>} />;
    case 'trivia_jam':
      return (
        <TriviaJamRoom room={room as TRoom<TriviaJamState>} myUserId={userId} />
      );
    default:
      return null;
  }
};
