import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { ClubTabComponent } from './club-tab.component';

export const ClubTab = () => {
  const { clubTabActor } = useContext(AppContext);

  const roomStore = useSelector(
    clubTabActor,
    (state) => state.context.roomStore
  );

  if (!roomStore) {
    return null; // todo loading placeholder
  }

  return <ClubTabComponent store={roomStore} />;
};
