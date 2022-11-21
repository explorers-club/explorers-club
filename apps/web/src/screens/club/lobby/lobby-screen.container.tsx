import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../../lib/logging';
import { memo, useCallback } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectLobbyScreenActor } from '../club-screen.selectors';
import { Button } from '@atoms/Button';
import { useFooter } from '../../../state/footer.hooks';
import { LobbyScreenComponent } from './lobby-screen.component';

export const LobbyScreen = memo(() => {
  const actor = useClubScreenActor();
  const lobbyActor = useSelector(actor, selectLobbyScreenActor);
  useActorLogger(lobbyActor);
  useFooter(<LobbyFooter />);
  console.log({ lobbyActor });

  return <LobbyScreenComponent />;
});

const LobbyFooter = () => {
  const actor = useClubScreenActor();
  const handlePress = useCallback(() => {
    actor.send('PRESS_JOIN');
  }, [actor]);
  return (
    <Button size="3" color="blue" fullWidth onClick={handlePress}>
      Join Party
    </Button>
  );
};
