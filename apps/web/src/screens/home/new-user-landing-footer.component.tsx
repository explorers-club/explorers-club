import { useSelector } from '@xstate/react';
import { FC, FormEvent, useCallback, useRef } from 'react';
import { Button } from '../../components/atoms/Button';
import { useHomeScreenActor } from './home-screen.hooks';
import { HomeScreenEvents } from './home-screen.machine';
import {
  selectNameIsAvailable,
  selectNameIsUnavailable,
} from './home-screen.selectors';

export const NewUserLandingFooter: FC = () => {
  const homeActor = useHomeScreenActor();

  const playerName = useSelector(
    homeActor,
    (state) => state.context.playerName
  );
  const nameIsAvailable = useSelector(homeActor, selectNameIsAvailable);
  const nameIsUnavailable = useSelector(homeActor, selectNameIsUnavailable);

  return (
    <Button
      type="submit"
      fullWidth
      size="2"
      color={nameIsAvailable ? 'green' : nameIsUnavailable ? 'red' : 'blue'}
    >
      {playerName
        ? nameIsAvailable
          ? `'${playerName}' Is Available. Claim it!`
          : nameIsUnavailable
          ? `'${playerName}' Is Unavailable`
          : 'Create Club'
        : 'Create Club'}
    </Button>
  );
};
