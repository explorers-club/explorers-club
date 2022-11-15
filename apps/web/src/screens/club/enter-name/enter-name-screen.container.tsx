import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { EnterName } from './enter-name.component';
import { EnterNameActor } from './enter-name.machine';

export const EnterNameScreen = () => {
  const clubScreenActor = useClubScreenActor();
  const formActor = useChildActor<EnterNameActor>(
    clubScreenActor,
    'EnteringName'
  );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formActor && <EnterName formActor={formActor} />}</>;
};
