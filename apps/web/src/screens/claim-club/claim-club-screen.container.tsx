import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { useChildActor } from '../../state/utils';
import { ClaimClubContext } from './claim-club.context';
import { EnterEmail } from './enter-email.container';
import { EnterEmailActor } from './enter-email.machine';
import { EnterPassword } from './enter-password.container';
import { EnterPasswordActor } from './enter-password.machine';

export const ClaimClubScreen = () => {
  const { actor } = useContext(ClaimClubContext);
  const isCreatingAccount = useSelector(actor, (state) =>
    state.matches('CreatingAccount')
  );
  const isEnteringEmail = useSelector(actor, (state) =>
    state.matches('EnteringEmail')
  );
  const isEnteringPassword = useSelector(actor, (state) =>
    state.matches('EnteringPassword')
  );

  const enterEmailActor = useChildActor<EnterEmailActor>(
    actor,
    'EnteringEmail'
  );

  const enterPasswordActor = useChildActor<EnterPasswordActor>(
    actor,
    'EnteringPassword'
  );

  return (
    <>
      {isCreatingAccount && <Box>Creating account</Box>}
      {isEnteringEmail && enterEmailActor && (
        <EnterEmail actor={enterEmailActor} />
      )}
      {isEnteringPassword && enterPasswordActor && (
        <EnterPassword actor={enterPasswordActor} />
      )}
    </>
  );
};

