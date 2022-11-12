import { styled } from '@stitches/react';
import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import { Box } from '@explorers-club/components/atoms/Box';
import { Fieldset } from '@explorers-club/components/atoms/Fieldset';
import { Flex } from '@explorers-club/components/atoms/Flex';
import { Text } from '@explorers-club/components/atoms/Text';
import { TextField } from '@explorers-club/components/atoms/TextField';
import { useHomeScreenActor } from './home-screen.hooks';
import { HomeScreenEvents } from './home-screen.machine';
import {
  selectNameIsAvailable,
  selectNameIsUnavailable,
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
    <Box css={{ p: '$4' }}>
      <Flex style={{ flexDirection: 'column' }}>
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
      </Flex>
    </Box>
  );
}
