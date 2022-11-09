import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';

interface Props {
  playerName: string;
}

export const UnclaimedComponent: FC<Props> = ({ playerName }) => {
  const actor = useClubScreenActor();
  const handlePressClaim = useCallback(() => {
    actor.send(ClubScreenEvents.PRESS_CLAIM());
  }, [actor]);

  return (
    <Container>
      <h3>{playerName}'s explorers club is unclaimed</h3>
      <p>Make it yours</p>
      <div>
        <button onClick={handlePressClaim}>Claim '{playerName}'</button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
`;
