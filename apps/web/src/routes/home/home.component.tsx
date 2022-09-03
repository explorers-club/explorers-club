import { FormEvent, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useActorLogger } from '../../lib/logging';
import { useHomeActor } from './home.hooks';
import { HOME_EVENTS } from './home.machine';

export function Home() {
  const homeActor = useHomeActor();
  useActorLogger(homeActor);
  const partyCodeRef = useRef<HTMLInputElement>(null);

  const handleChangePartyCode = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      homeActor.send(
        HOME_EVENTS.INPUT_CHANGE_PARTY_CODE(partyCodeRef.current?.value || '')
      );
    },
    [partyCodeRef, homeActor]
  );

  const handleJoinParty = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      homeActor.send(HOME_EVENTS.PRESS_JOIN_PARTY());
      e.preventDefault();
    },
    [homeActor]
  );

  const handleStartParty = useCallback(() => {
    homeActor.send(HOME_EVENTS.PRESS_START_PARTY());
  }, [homeActor]);

  return (
    <Container>
      <p>Home</p>
      <form onSubmit={handleJoinParty}>
        <input
          ref={partyCodeRef}
          type="text"
          name="partyCode"
          onChange={handleChangePartyCode}
        />
        <input type="submit" value="Join" />
      </form>
      <button onClick={handleStartParty}>Start</button>
    </Container>
  );
}

const Container = styled.div``;
