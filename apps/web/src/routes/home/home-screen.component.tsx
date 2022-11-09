import { ChevronRightIcon } from '@radix-ui/react-icons';
import { styled } from '@stitches/react';
import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import { Box } from '../../components/atoms/Box';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Flex } from '../../components/atoms/Flex';
import { Input } from '../../components/atoms/Input';
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
  console.log({ nameIsAvailable, playerName });

  // const handleStartParty = useCallback(() => {
  //   homeActor.send(HomeScreenEvents.PRESS_CREATE());
  // }, [homeActor]);

  return (
    <Container>
      <h1>Welcome to Explorers Club</h1>
      <Flex style={{ flexDirection: 'column' }}>
        <Box>Start your club</Box>
        <Fieldset>
          <span>
            <Input
              ref={playerNameRef}
              type="text"
              id="playerName"
              placeholder="Teddy"
              pattern="^[a-zA-Z0-9_-]*$"
              onChange={handleChangePartyCode}
            />
            's Explorers Club
          </span>
          {playerName && nameIsAvailable && (
            <Box>{playerName} is available</Box>
          )}
          {playerName && nameIsUnavailable && (
            <Box>{playerName} is unavailable. Choose another name</Box>
          )}
        </Fieldset>
        <Button variant="primary">Claim Club</Button>
      </Flex>
    </Container>
  );
}

const Container = styled('div', {
  padding: '16px',
});
