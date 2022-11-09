import { useSelector } from '@xstate/react';
import { useClubScreenActor } from './club-screen.hooks';
import { EnterPhoneNumber } from './enter-phone-number.component';
import { Loading } from './loading.component';

export const Claiming = () => {
  const actor = useClubScreenActor();
  //   const isInitializing = useSelector(actor, (state) =>
  //     state.matches('Unclaimed.Claiming.Initializing')
  //   );
  //   const isCreatingAccount = useSelector(actor, (state) =>
  //     state.matches('Unclaimed.Claiming.CreateAccount')
  //   );
  const isEnteringPhoneNumber = useSelector(actor, (state) =>
    state.matches('Unclaimed.Claiming.EnterPhoneNumber')
  );

  if (isEnteringPhoneNumber) {
    return <EnterPhoneNumber />;
  }

  return <Loading />;
};
