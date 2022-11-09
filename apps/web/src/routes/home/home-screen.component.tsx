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

  return (
    <Container>
      <Text as="h1">Welcome to Explorers Club</Text>
      <Flex style={{ flexDirection: 'column' }}>
        <Box>Enter your player name.</Box>
        <Fieldset>
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
          <Text>'s Explorers Club</Text>
        </Fieldset>
        <Button
          size="2"
          color={nameIsAvailable ? 'green' : nameIsUnavailable ? 'red' : 'blue'}
        >
          {playerName
            ? nameIsAvailable
              ? `${playerName} Is Available`
              : nameIsUnavailable
              ? `${playerName} Is Unavailable`
              : 'Create Club'
            : 'Create Club'}
          {/* {playerName ? nameIsAvailable ? 
            `'/${playerName}' is available—Claim It!`
          :
          nameIsUnavailable ? `Unavailable` : "Claim Your Club"
        } */}
        </Button>
      </Flex>
    </Container>
  );
}

const Container = styled('div', {
  padding: '16px',
});
