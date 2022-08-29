import { useCallback } from 'react';
import styled from 'styled-components';

export function LobbyComponent() {
  const handlePressStartParty = useCallback(() => {
    console.log('start party');
  }, []);

  return (
    <Container>
      <p>
        <span>Enter your 4-digit code</span>
        <input type="text" name="code" id="code" />
        <button>Join Party</button>
      </p>
      <p>
        <span>or</span>
        <button onClick={handlePressStartParty}>Start Party</button>
      </p>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120px;
  background: white;
  z-index: 1;
`;
