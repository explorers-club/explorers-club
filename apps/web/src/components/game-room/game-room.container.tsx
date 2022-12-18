import React, { FC, useContext } from 'react';
import { Room, Room as TRoom } from 'colyseus.js';
import { useQuery } from 'react-query';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';
import { ColyseusContext } from '../../state/colyseus.context';
import { ClubState } from '@explorers-club/schema-types/ClubState';

interface Props {
  roomId: string;
  clubRoom: Room<ClubState>;
}

export const GameRoom: FC<Props> = ({ roomId, clubRoom }) => {
  const colyseusClient = useContext(ColyseusContext);

  const query = useQuery('game_room', async () => {
    const { players } = clubRoom.state;
    const myPlayer = players.get(clubRoom.sessionId);
    if (!myPlayer) {
      throw new Error(`tried to join ${roomId} but couldn't find player`);
    }

    return await colyseusClient.joinById(roomId, {
      name: myPlayer.name,
    });
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
