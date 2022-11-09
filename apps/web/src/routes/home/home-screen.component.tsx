import { styled } from '@stitches/react';
import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import { Box } from '../../components/atoms/Box';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Flex } from '../../components/atoms/Flex';
import { Text } from '../../components/atoms/Text';
import { TextField } from '../../components/atoms/TextField';
import { useActorLogger } from '../../lib/logging';
import { useHomeScreenActor } from './home-screen.hooks';
import { HomeScreenEvents } from './home-screen.machine';

export function HomeScreen() {
  const homeActor = useHomeScreenActor();
  useActorLogger(homeActor);

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

  const playerName = useSelector(
    homeActor,
    (state) => state.context.playerName
  );
  const nameIsAvailable = useSelector(homeActor, (state) =>
    state.matches('NameInput.Availability.Available')
  );
  const nameIsUnavailable = useSelector(homeActor, (state) =>
    state.matches('NameInput.Availability.Unavailable')
  );

  const handleFormSubmit = useCallback(() => {
    homeActor.send(HomeScreenEvents.PRESS_CREATE());
  }, [homeActor]);

  return (
    <Container>
      <h2>Welcome to Explorers Club!</h2>
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
          <Button
            type="submit"
            fullWidth
            size="2"
            color={
              nameIsAvailable ? 'green' : nameIsUnavailable ? 'red' : 'blue'
            }
          >
            {playerName
              ? nameIsAvailable
                ? `'${playerName}' Is Available. Claim it!`
                : nameIsUnavailable
                ? `'${playerName}' Is Unavailable`
                : 'Create Club'
              : 'Create Club'}
          </Button>
        </form>
      </Flex>
    </Container>
  );
}

const Container = styled('div', {
  padding: '16px',
});
