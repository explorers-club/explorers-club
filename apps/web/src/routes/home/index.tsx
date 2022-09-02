import { useSelector } from '@xstate/react';
import { FormEvent, useCallback, useContext, useRef } from 'react';
import styled from 'styled-components';
import { GlobalStateContext } from '../../state/global.provider';
import { selectHomeActor } from '../../state/navigation.selectors';
import { homeModel } from './home.machine';

export function Home() {
  const { appActor } = useContext(GlobalStateContext);
  const homeActor = useSelector(appActor, selectHomeActor);
  const partyCodeRef = useRef<HTMLInputElement>(null);

  const handleJoinParty = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      homeActor.send(homeModel.events.PRESS_JOIN_PARTY());
      e.preventDefault();
    },
    [homeActor]
  );

  const handleStartParty = useCallback(() => {
    console.log('start', homeActor);
    homeActor.send(homeModel.events.PRESS_START_PARTY());
  }, [homeActor]);

  return (
    <Container>
      <p>Home</p>
      <form onSubmit={handleJoinParty}>
        <input ref={partyCodeRef} type="text" name="partyCode" />
        <input type="submit" value="Join" />
      </form>
      <button onClick={handleStartParty}>Start</button>
    </Container>
  );
}

const Container = styled.div``;
