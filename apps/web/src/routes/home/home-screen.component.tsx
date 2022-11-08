import * as LabelPrimitive from '@radix-ui/react-label';
import { styled } from '@stitches/react';
import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Flex } from '../../components/atoms/Flex';
import { Input } from '../../components/atoms/Input';
import { Label } from '../../components/atoms/Label';
import { useActorLogger } from '../../lib/logging';
import { useHomeScreenActor } from './home-screen.hooks';
import { HomeScreenEvents } from './home-screen.machine';

export function HomeScreen() {
  const homeActor = useHomeScreenActor();
  useActorLogger(homeActor);
  const errorMessage = useSelector(
    homeActor,
    (state) => state.context.inputErrorMessage
  );

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

  const handleStartParty = useCallback(() => {
    homeActor.send(HomeScreenEvents.PRESS_CREATE());
  }, [homeActor]);

  return (
    <Container>
      <h1>Welcome to Explorers Club</h1>
      <Flex style={{ flexDirection: 'column' }}>
        <p>Start your club</p>
        <Fieldset>
          <span>
            <Input
              ref={playerNameRef}
              type="text"
              id="playerName"
              defaultValue="Teddy"
              onChange={handleChangePartyCode}
            />
            's Explorers Club
          </span>
        </Fieldset>
        <Button variant="mauve">Claim It</Button>
      </Flex>
    </Container>
  );
}

const Container = styled('div', {
  padding: '16px',
});
