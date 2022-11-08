import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';

export const ClubScreen = () => {
  const { playerName } = useParams();
  //   const { authActor } = useContext(GlobalStateContext);

  const { isFetching, isSuccess } = useQuery({
    queryKey: ['playersByName', playerName],
    queryFn: () => fetchUserProfileByName(playerName),
  });

  if (!playerName) {
    return <Container>error parsing URL</Container>;
  }

  if (isFetching) {
    return <Container>...</Container>;
  }

  if (!isSuccess) {
    return <Unclaimed playerName={playerName} />;
  }

  return <Party hostPlayerName={playerName} />;
};

const Party = ({ hostPlayerName }: { hostPlayerName: string }) => {
  return <Container>{hostPlayerName}</Container>;
};

const Unclaimed = ({ playerName }: { playerName?: string }) => {
  const handlePressClaim = useCallback(() => {
    // Enter a name
    console.log(playerName);
  }, [playerName]);

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
