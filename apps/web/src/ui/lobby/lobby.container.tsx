import { useInterpret, useSelector } from '@xstate/react';
import { Fragment, useContext } from 'react';
import { AppServiceContext } from '../../app/app.service';
import { LobbyComponent } from './lobby.component';
import lobbyMachine from './lobby.machine';
import { LobbyServiceContext } from './lobby.service';

export function Lobby() {
  const appService = useContext(AppServiceContext);
  const inLobby = useSelector(appService, (state) => state.matches('Lobby'));

  const lobbyService = useInterpret(lobbyMachine);

  if (!inLobby) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fragment />;
  }

  return (
    <LobbyServiceContext.Provider value={lobbyService}>
      <LobbyComponent />;
    </LobbyServiceContext.Provider>
  );
}
