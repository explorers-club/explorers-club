import { useSelector } from '@xstate/react';
import { Fragment, useContext } from 'react';
import { ConnectedContext } from '../../state/connected.context';
import GameScene from './game.scene';

export const Game = () => {
  const { partyActor } = useContext(ConnectedContext);
  const inGame = useSelector(partyActor, (state) => state.matches('Game'));

  if (!inGame) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fragment />;
  }

  return <GameScene />;
};
