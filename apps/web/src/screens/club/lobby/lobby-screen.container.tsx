import { useActorLogger } from '../../../lib/logging';
import { memo } from 'react';
import { LobbyScreenComponent } from './lobby-screen.component';
import { useLobbyScreenActor } from './lobby-screen.hooks';
import { useSelector } from '@xstate/react';
import { selectIsEnteringName } from './lobby-screen.selectors';
import { EnterName } from './enter-name.container';

export const LobbyScreen = memo(() => {
  const actor = useLobbyScreenActor();
  useActorLogger(actor);
  // const footerComponent = useFooterComponent();
  // useFooter(footerComponent);
  const lobbyScreenActor = useLobbyScreenActor();
  const isEnteringName = useSelector(lobbyScreenActor, selectIsEnteringName);

  if (isEnteringName) {
    return <EnterName />;
  }

  return <LobbyScreenComponent />;
});

// const useFooterComponent = () => {
//   const actor = useLobbyScreenActor();
//   useActorLogger(actor);
//   const isSpectating = useSelector(actor, selectIsSpectating);

//   if (isSpectating) {
//     return <JoinFooter />;
//   }

//   return null;
// };
