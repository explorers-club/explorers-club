import { DiffusionaryStore, LittleVigilanteStore, TriviaJamStore } from '@explorers-club/room';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { LittleVigilanteRoom } from '@explorers-club/little-vigilante/ui';
import { useSelector } from '@xstate/react';
import { FC, useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import { GameTabActor } from './game-tab.machine';
import { DiffusionaryRoom } from '@explorers-club/diffusionary/ui';

interface Props {
  actor: GameTabActor;
}

export const GameTabComponent: FC<Props> = ({ actor }) => {
  const [gameId, store] = useSelector(actor, ({ context }) => [
    context.gameId,
    context.store,
  ]);
  const { userId } = useContext(AuthContext);

  if (!gameId || !store) {
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
