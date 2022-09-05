import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useActorLogger } from '../../lib/logging';
import { useHomeActor } from './home.hooks';
import { HOME_EVENTS } from './home.machine';

export function Home() {
  const homeActor = useHomeActor();
  useActorLogger(homeActor);

  const hasValidationError = useSelector(homeActor, (state) =>
    state.matches('ValidationError')
  );

  // const validationError = useSelector(appActor, selectHomeValidationError);
  // console.log

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
      <h2>Join party</h2>
      <p>Enter 4-digit code</p>
      <form onSubmit={handleJoinParty}>
        {hasValidationError && (
          <ErrorMessage>Codes should be 4-digits and alpha-numeric.</ErrorMessage>
        )}
        <input
          ref={partyCodeRef}
          type="text"
          name="partyCode"
          onChange={handleChangePartyCode}
        />
        <input type="submit" value="Join" />
      </form>
      <h3>Start new party</h3>
      <button onClick={handleStartParty}>Start</button>
    </Container>
  );
}

const ErrorMessage = styled.span`
  color: red;
`;

const Container = styled.div`
  padding: 24px;
`;
