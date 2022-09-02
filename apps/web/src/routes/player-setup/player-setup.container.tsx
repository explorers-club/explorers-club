import { useCallback } from 'react';
import { PlayerSetupComponent } from './player-setup.component';

export function PlayerSetup() {
  // const { appActor } = useContext(GlobalStateContext);
  // useSelector(appActor, selectPlayerSetupActor0w)
  // const [_, send] = useMachine(playerSetupMachine);

  // Set up a listener such that
  // on machine complete
  // How do we send that back to the app machine?

  const handleSubmit = useCallback((name: string) => {
    // send(playerSetupModel.events.SUBMIT(name));
  }, []);

  return <PlayerSetupComponent onSubmit={handleSubmit} />;
}
