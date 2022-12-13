import { HangoutState } from '@explorers-club/schema';
import { Room } from 'colyseus.js';
import React, { FC } from 'react';
import { HangoutRoomComponent } from './hangout-room.component';

interface Props {
  room: Room<HangoutState>;
}

export const HangoutRoom: FC<Props> = ({ room }) => {
  return <HangoutRoomComponent room={room} />;
};
