import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';
import { useHomeScreenActor } from './home-screen.hooks';
import {
  selectShowWelcomeBack
} from './home-screen.selectors';
import { NewUserLanding } from './new-user-landing.component';
import { WelcomeBack } from './welcome-back.component';

export function HomeScreen() {
  const homeActor = useHomeScreenActor();
  useActorLogger(homeActor);

  const showWelcomeBack = useSelector(homeActor, selectShowWelcomeBack);

  if (showWelcomeBack) {
    return <WelcomeBack />;
  }

  return <NewUserLanding />;
}
