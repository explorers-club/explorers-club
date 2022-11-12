import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { createSelector } from 'reselect';
import { Button } from '../../components/atoms/Button';
import { selectLayoutMetadata } from '../layout.selectors';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import {
  selectHostPlayerName,
  selectIsClaimable,
} from './club-screen.selectors';

export const ClubScreenFooter = () => {
  const actor = useClubScreenActor();

  const isClaimable = useSelector(actor, selectIsClaimable);
  const hostPlayerName = useSelector(actor, selectHostPlayerName);

  const handlePressClaim = useCallback(() => {
    actor.send(ClubScreenEvents.PRESS_CLAIM());
  }, [actor]);

  if (isClaimable) {
    return (
      <Button fullWidth size="3" onClick={handlePressClaim}>
        Claim '/{hostPlayerName}'
      </Button>
    );
  }

  return <></>;
};

const selectHeaderMetadata = createSelector(
  selectLayoutMetadata,
  (meta) => meta?.footer
);
