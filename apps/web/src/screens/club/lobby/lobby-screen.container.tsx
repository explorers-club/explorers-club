import { useActorLogger } from '../../../lib/logging';
import { memo } from 'react';
import { LobbyScreenComponent } from './lobby-screen.component';
import { useLobbyScreenActor } from './lobby-screen.hooks';

export const LobbyScreen = memo(() => {
  const actor = useLobbyScreenActor();
  useActorLogger(actor);
  // const footerComponent = useFooterComponent();
  // useFooter(footerComponent);

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
