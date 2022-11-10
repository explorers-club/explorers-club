import { useSelector } from '@xstate/react';
import { useClubScreenActor } from './club-screen.hooks';
import { EnterEmail } from './enter-email.component';
import { EnterEmailActor } from './enter-email.machine';
import { EnterPassword } from './enter-password.component';
import { EnterPasswordActor } from './enter-password.machine';
import { Loading } from './loading.component';

export const Claiming = () => {
  const actor = useClubScreenActor();
  //   const isInitializing = useSelector(actor, (state) =>
  //     state.matches('Unclaimed.Claiming.Initializing')
  //   );
  //   const isCreatingAccount = useSelector(actor, (state) =>
  //     state.matches('Unclaimed.Claiming.CreateAccount')
  //   );
  const isEnteringEmail = useSelector(actor, (state) =>
    state.matches('Unclaimed.Claiming.EnterEmail')
  );
  const isEnteringPassword = useSelector(actor, (state) =>
    state.matches('Unclaimed.Claiming.EnterPassword')
  );

  const enterEmailActor = useSelector(
    actor,
    (state) =>
      state.children[
        'ClubScreenMachine.Unclaimed.Claiming.EnterEmail:invocation[0]'
      ] as EnterEmailActor
  );
  const enterPasswordActor = useSelector(
    actor,
    (state) =>
      state.children[
        'ClubScreenMachine.Unclaimed.Claiming.EnterPassword:invocation[0]'
      ] as EnterPasswordActor
  );

  if (isEnteringEmail) {
    return <EnterEmail formActor={enterEmailActor} />;
  }

  if (isEnteringPassword) {
    return <EnterPassword formActor={enterPasswordActor} />;
  }

  return <Loading />;
};
