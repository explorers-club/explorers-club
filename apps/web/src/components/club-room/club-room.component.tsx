import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { EnterNameScreen } from './enter-name-screen.component';
// import { ConfigurationScreen } from './configuration-screen.container';
import { ClubRoomContext } from './club-room.context';
import { MainScreen } from './main-screen.container';
import { ConfigurationScreen } from './configuration-screen.container';

export const ClubRoomComponent = () => {
  const service = useContext(ClubRoomContext);

  const state = useSelector(service, (state) => state);
  console.log(state);

  switch (true) {
    case state.matches('EnteringName'):
      return <EnterNameScreen />;
    case state.matches('Idle'):
      return <MainScreen />;
    case state.matches('Configuring'):
      return <ConfigurationScreen />;
    default:
      return null;
  }
};
