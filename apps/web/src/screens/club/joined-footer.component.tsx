import { Button } from '@atoms/Button';
import {
  PartyPlayerActor,
  PartyPlayerEvents,
  selectPlayerIsReady,
} from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';

interface Props {
  myActor: PartyPlayerActor;
}

export const JoinedFooterComponent: FC<Props> = ({ myActor }) => {
  const isReady = useSelector(myActor, selectPlayerIsReady);

  const handlePressNotReady = useCallback(() => {
    myActor.send(PartyPlayerEvents.PLAYER_UNREADY());
  }, [myActor]);

  const handlePressReady = useCallback(() => {
    myActor.send(PartyPlayerEvents.PLAYER_READY());
  }, [myActor]);

  return isReady ? (
    <Button fullWidth color="gray" size="3" onClick={handlePressNotReady}>
      Not Ready
    </Button>
  ) : (
    <Button fullWidth color="green" size="3" onClick={handlePressReady}>
      Ready Up
    </Button>
  );
};
