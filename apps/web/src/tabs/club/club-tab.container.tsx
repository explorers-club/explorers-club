import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { ClubTabComponent } from './club-tab.component';
import { DisconnectHandler } from './components/disconnect-handler.component';
import { ErrorHandler } from './components/error-handler.component';

export const ClubTab = () => {
  const { clubTabActor } = useContext(AppContext);
  const store = useSelector(clubTabActor, (state) => state.context.store);

  return (
    <>
      <DisconnectHandler />
      <ErrorHandler />
      {store && <ClubTabComponent store={store} />}
    </>
  );
};
