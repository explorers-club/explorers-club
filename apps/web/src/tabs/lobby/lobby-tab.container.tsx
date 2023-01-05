import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { LobbyTabComponent } from './lobby-tab.component';

export const LobbyTab = () => {
  const { lobbyTabActor, tabBarActor, clubTabActor } = useContext(AppContext);

  return (
    <LobbyTabComponent
      actor={lobbyTabActor}
      tabBarActor={tabBarActor}
      clubTabActor={clubTabActor}
    />
  );
};
