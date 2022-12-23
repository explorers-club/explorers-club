import { useInterpret } from '@xstate/react';
import { FC, useContext, useMemo } from 'react';
import { AuthContext } from '../../state/auth.context';
import { ClubStore } from '../../type';
import { ClubRoomComponent } from './club-room.component';
import { ClubRoomContext } from './club-room.context';
import { clubRoomMachine } from './club-room.machine';

interface Props {
  store: ClubStore;
}

export const ClubRoom: FC<Props> = ({ store }) => {
  const { userId } = useContext(AuthContext);
  const machine = useMemo(
    () => clubRoomMachine.withContext({ store, myUserId: userId }),
    [store, userId]
  );
  const service = useInterpret(machine);

  return (
    <ClubRoomContext.Provider value={service}>
      <ClubRoomComponent />
    </ClubRoomContext.Provider>
  );
};
