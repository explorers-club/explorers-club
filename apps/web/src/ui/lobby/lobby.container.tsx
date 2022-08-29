import { useSelector } from '@xstate/react';
import { Fragment, useContext } from 'react';
import { AppServiceContext } from '../../app/app.service';
import { LobbyComponent } from './lobby.component';

export function Lobby() {
  const appService = useContext(AppServiceContext);
  const inLobby = useSelector(appService, (state) => state.matches('Lobby'));

  const Component = inLobby ? LobbyComponent : Fragment;

  return <Component />;
}
