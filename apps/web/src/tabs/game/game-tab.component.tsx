import { TriviaJamStore } from '@explorers-club/room';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/ui';
import { useSelector } from '@xstate/react';
import { FC, useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import { GameTabActor } from './game-tab.machine';

interface Props {
  actor: GameTabActor;
}

export const GameTabComponent: FC<Props> = ({ actor }) => {
  const [type, store] = useSelector(actor, ({ context }) => [
    context.type,
    context.store,
  ]);
  const { userId } = useContext(AuthContext);

  if (!type || !store) {
    return null; // todo loader
  }

  switch (type) {
    case 'trivia_jam':
      return (
        <TriviaJamRoom store={store as TriviaJamStore} myUserId={userId} />
      );
    default:
      return null;
  }
};
