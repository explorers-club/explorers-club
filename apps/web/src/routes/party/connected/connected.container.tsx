import { useSelector } from '@xstate/react';
import styled from 'styled-components';
import { usePartyScreenActor } from '../party-screen.hooks';
import { CreateAccount } from './create-account.component';
import { JoinError } from './join-error.component';
import { Joined } from './joined';
import { JoinedContext } from './joined/joined.context';
import { Joining } from './joining.component';
import { Spectating } from './spectating.component';

export const Connected = () => {
  const actor = usePartyScreenActor();

  const isSpectating = useSelector(actor, (state) =>
    state.matches('Connected.Spectating')
  );
  const isJoining = useSelector(actor, (state) =>
    state.matches('Connected.Joining')
  );
  const isCreatingAccount = useSelector(actor, (state) =>
    state.matches('Connected.CreateAccount')
  );
  const isJoined = useSelector(actor, (state) =>
    state.matches('Connected.Joined')
  );
  const isJoinError = useSelector(actor, (state) =>
    state.matches('Connected.JoinError')
  );
  const myActor = useSelector(actor, (state) => state.context.myActor);

  return (
    <Container>
      {isSpectating && <Spectating />}
      {isJoining && <Joining />}
      {isCreatingAccount && <CreateAccount />}
      {isJoined && myActor && (
        <JoinedContext.Provider value={{ myActor }}>
          <Joined />
        </JoinedContext.Provider>
      )}
      {isJoinError && <JoinError />}
    </Container>
  );
};

const Container = styled.div``;
