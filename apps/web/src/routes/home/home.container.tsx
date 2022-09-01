import { useInterpret } from '@xstate/react';
import { useContext } from 'react';
import { HomeComponent } from './home.component';
import homeMachine from './home.machine';
import { HomeServiceContext } from './home.service';

export function Home() {
  const homeService = useInterpret(homeMachine);

  return (
    <HomeServiceContext.Provider value={homeService}>
      <HomeComponent />
    </HomeServiceContext.Provider>
  );
}
