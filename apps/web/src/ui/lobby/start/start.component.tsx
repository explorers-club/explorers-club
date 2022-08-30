import { useCallback, useContext, useRef } from 'react';
import styled from 'styled-components';
import { lobbyModel } from '../lobby.machine';
import { LobbyServiceContext } from '../lobby.service';

export function StartComponent() {
  const lobbyService = useContext(LobbyServiceContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePressJoinParty = useCallback(() => {
    const code = inputRef.current?.value;
    // TODO validate input
    if (code) {
      lobbyService.send(lobbyModel.events.JOIN_PARTY(code));
    }
  }, [lobbyService, inputRef]);

  const handlePressStartParty = useCallback(() => {
    lobbyService.send(lobbyModel.events.START_PARTY());
  }, [lobbyService]);

  return (
    <Container>
      <p>
        <span>Enter your 4-digit code</span>
        <input ref={inputRef} type="text" name="code" id="code" />
        <button onClick={handlePressJoinParty}>Join Party</button>
      </p>
      <p>
        <span>or</span>
        <button onClick={handlePressStartParty}>Start Party</button>
      </p>
    </Container>
  );
}

const Container = styled.div``;
