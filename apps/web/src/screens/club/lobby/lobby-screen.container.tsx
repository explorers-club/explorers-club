import { useActorLogger } from '../../../lib/logging';
import { memo } from 'react';
import { LobbyScreenComponent } from './lobby-screen.component';
import { useLobbyScreenActor } from './lobby-screen.hooks';
import { useSelector } from '@xstate/react';
import { selectIsEnteringName } from './lobby-screen.selectors';
import { EnterNameScreen } from './enter-name-screen.container';

export const LobbyScreen = memo(() => {
  const actor = useLobbyScreenActor();
  useActorLogger(actor);
  // const footerComponent = useFooterComponent();
  // useFooter(footerComponent);
  const lobbyScreenActor = useLobbyScreenActor();
  const isEnteringName = useSelector(lobbyScreenActor, selectIsEnteringName);

  if (isEnteringName) {
    return <EnterNameScreen />;
  }

  return <LobbyScreenComponent />;
});
