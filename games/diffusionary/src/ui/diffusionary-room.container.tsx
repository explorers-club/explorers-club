import { FC } from 'react';
import { Room } from 'colyseus.js';
import { DiffusionaryRoomComponent } from './diffusionary-room.component';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';

interface Props {
  room: Room<DiffusionaryState>;
}

export const DiffusionaryRoom: FC<Props> = ({ room }) => {
  return <DiffusionaryRoomComponent />;
};
