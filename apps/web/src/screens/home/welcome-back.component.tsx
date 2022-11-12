import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectPlayerName } from '../../state/auth.selectors';
import { GlobalStateContext } from '../../state/global.provider';
import { Container } from '../club/club.styles';
import { useHomeScreenActor } from './home-screen.hooks';

export const WelcomeBack = () => {
  const { authActor } = useContext(GlobalStateContext);
  const playerName = useSelector(authActor, selectPlayerName);

  return <Container>Welcome back, {playerName}</Container>;
};
