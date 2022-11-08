import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';

export const ClubScreen = () => {
  const { playerName } = useParams();
  const { data, error } = useQuery({
    queryKey: ['playersByName', playerName],
    queryFn: () => fetchUserProfileByName(playerName),
  });

  console.log({ data, error });
  return <div />;
};
