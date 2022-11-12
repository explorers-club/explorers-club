import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';
import { useHomeScreenActor } from './home-screen.hooks';
import {
  selectShowWelcomeBack
} from './home-screen.selectors';
import { NewUserLanding } from './new-user-landing.component';
import { WelcomeBack } from './welcome-back.component';

export function HomeScreen() {
  // TODO Refactor this component to support
  // more of a feed of Cards / Modules

  // Atop the feed will be a NowPlaying module
  // Below it will be a StartYourClub module

  // Each module loads in dynamically and has it's
  // own loading state
  const homeActor = useHomeScreenActor();
  useActorLogger(homeActor);

  const showWelcomeBack = useSelector(homeActor, selectShowWelcomeBack);

  if (showWelcomeBack) {
    return <WelcomeBack />;
  }

  return <NewUserLanding />;
}
