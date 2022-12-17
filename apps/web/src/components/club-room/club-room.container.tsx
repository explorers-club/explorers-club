import { ClubState } from '@explorers-club/schema-types/ClubState';
import { useInterpret } from '@xstate/react';
import { Room } from 'colyseus.js';
import { FC } from 'react';
import { ClubRoomComponent } from './club-room.component';
import { ClubRoomContext } from './club-room.context';
import { clubRoomMachine } from './club-room.machine';

interface Props {
  room: Room<ClubState>;
}

export const ClubRoom: FC<Props> = ({ room }) => {
  const service = useInterpret(clubRoomMachine.withContext({ room }));

  return (
    <ClubRoomContext.Provider value={service}>
      <ClubRoomComponent />
    </ClubRoomContext.Provider>
  );
};
