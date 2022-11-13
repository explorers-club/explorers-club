import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Fieldset } from '@atoms/Fieldset';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import { useHomeScreenActor } from './home-screen.hooks';
import { HomeScreenEvents } from './home-screen.machine';
import {
  selectNameIsAvailable,
  selectNameIsUnavailable
} from './home-screen.selectors';

export function NewUserLanding() {
  const homeActor = useHomeScreenActor();

  const playerNameRef = useRef<HTMLInputElement>(null);

  const handleChangePartyCode = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      homeActor.send(
        HomeScreenEvents.INPUT_CHANGE_PLAYER_NAME(
          playerNameRef.current?.value || ''
        )
      );
    },
    [playerNameRef, homeActor]
  );

  const nameIsAvailable = useSelector(homeActor, selectNameIsAvailable);
  const nameIsUnavailable = useSelector(homeActor, selectNameIsUnavailable);

  const handleFormSubmit = useCallback(() => {
    homeActor.send(HomeScreenEvents.PRESS_CREATE());
  }, [homeActor]);

  return (
    <Box css={{ p: '$5' }}>
      <Flex css={{ fd: 'column' }}>
        <Card css={{ p: '$4' }}>
          <form onSubmit={handleFormSubmit}>
            <Box>Choose a player name you would like to use.</Box>
            <Fieldset>
              <Text>explorers.club/</Text>
              <TextField
                ref={playerNameRef}
                size="2"
                type="text"
                id="playerName"
                state={
                  nameIsAvailable
                    ? 'valid'
                    : nameIsUnavailable
                    ? 'invalid'
                    : undefined
                }
                placeholder="Teddy"
                pattern="^[a-zA-Z0-9_-]*$"
                fullWidth={false}
                onChange={handleChangePartyCode}
              />
            </Fieldset>
          </form>
        </Card>
      </Flex>
    </Box>
  );
}
