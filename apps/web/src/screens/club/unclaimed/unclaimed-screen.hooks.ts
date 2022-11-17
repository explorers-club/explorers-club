import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { UnclaimedScreenActor } from './unclaimed-screen.machine';

export const useUnclaimedScreenActor = () => {
  const actor = useClubScreenActor();
  return useChildActor<UnclaimedScreenActor>(actor, 'Unclaimed');
};
