import {
  DiffusionaryStore,
  isLittleVigilanteEvent,
  LittleVigilanteStore,
  TriviaJamStore,
} from '@explorers-club/room';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { LittleVigilanteRoom } from '@explorers-club/little-vigilante/ui';
import { useSelector } from '@xstate/react';
import { FC, useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import { GameTabActor } from './game-tab.machine';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';
import { filter } from 'rxjs';

interface Props {
  actor: GameTabActor;
}

export const GameTabComponent: FC<Props> = ({ actor }) => {
  const [gameId, store, event$] = useSelector(actor, ({ context }) => [
    context.gameId,
    context.store,
    context.event$,
  ]);
  const { userId } = useContext(AuthContext);

  if (!gameId || !store || !event$) {
    return null; // todo loader
  }

  switch (gameId) {
    case 'trivia_jam':
      return (
        <TriviaJamRoom store={store as TriviaJamStore} myUserId={userId} />
      );
    case 'little_vigilante':
      return (
        <LittleVigilanteRoom
          store={store as LittleVigilanteStore}
          myUserId={userId}
          event$={event$.pipe(filter(isLittleVigilanteEvent))}
        />
      );
    case 'diffusionary':
      return (
        <DiffusionaryRoom
          store={store as DiffusionaryStore}
          myUserId={userId}
        />
      );
    default:
      return null;
  }
};
