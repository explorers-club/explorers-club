import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { EnterNameComponent } from './enter-name.component';
import { EnterNameActor } from './enter-name.machine';

export const EnterName = () => {
  const clubScreenActor = useClubScreenActor();
  const formActor = useChildActor<EnterNameActor>(
    clubScreenActor,
    'EnteringName'
  );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formActor && <EnterNameComponent formActor={formActor} />}</>;
};
