import { useServiceSelector } from '../services';
import { HomeScreen } from './home-screen.component';
import { RoomScreen } from './room-screen.component';

export const MainScreen = () => {
  const showHome = useServiceSelector('appService', (state) =>
    state.matches('Current.Home')
  );
  const showRoom = useServiceSelector('appService', (state) =>
    state.matches('Current.Room')
  );

  return <>{(showHome && <HomeScreen />) || (showRoom && <RoomScreen />)}</>;
};
