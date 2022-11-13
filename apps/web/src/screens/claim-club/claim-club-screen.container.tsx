import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { useActorLogger } from '../../lib/logging';
import { useChildActor } from '../../state/utils';
import { ClaimClubContext } from './claim-club.context';
import { EnterEmail } from './enter-email.container';
import { EnterEmailActor } from './enter-email.machine';
import { EnterPassword } from './enter-password.container';
import { EnterPasswordActor } from './enter-password.machine';
import { Error } from './error.component';

export const ClaimClubScreen = () => {
  const { actor } = useContext(ClaimClubContext);
  useActorLogger(actor);

  const errorMessage = useSelector(
    actor,
    (state) => state.context.errorMessage
  );

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

  if (errorMessage) {
    return <Error message={errorMessage} />;
  }

  return (
    <>
      {isCreatingAccount && <Box>Creating account</Box>}
      {isEnteringEmail && enterEmailActor && (
        <EnterEmail formActor={enterEmailActor} />
      )}
      {isEnteringPassword && enterPasswordActor && (
        <EnterPassword formActor={enterPasswordActor} />
      )}
    </>
  );
};
