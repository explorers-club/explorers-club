import { FormEvent, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export function HomeComponent() {
  const partyCodeRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleJoinParty = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const code = partyCodeRef.current?.value;
      // TODO validate
      if (code) {
        navigate(`/party/${code}`);
      }

      e.preventDefault();
    },
    [navigate]
  );

  const handleStartParty = useCallback(() => {
    navigate('/party/new');
  }, [navigate]);

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
