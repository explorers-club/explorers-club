import { HangoutState } from '@explorers-club/schema';
import { useInterpret } from '@xstate/react';
import { Room } from 'colyseus.js';
import { FC } from 'react';
import { HangoutRoomComponent } from './hangout-room.component';
import { HangoutRoomContext } from './hangout-room.context';
import { hangoutRoomMachine } from './hangout-room.machine';

interface Props {
  room: Room<HangoutState>;
}

export const HangoutRoom: FC<Props> = ({ room }) => {
  const service = useInterpret(hangoutRoomMachine.withContext({ room }));

  return (
    <HangoutRoomContext.Provider value={service}>
      <HangoutRoomComponent />
    </HangoutRoomContext.Provider>
  );
};
