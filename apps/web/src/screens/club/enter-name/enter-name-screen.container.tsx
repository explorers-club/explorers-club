import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { EnterNameForm, EnterNameActor } from '@organisms/enter-name-form';

export const EnterNameScreen = () => {
  const clubScreenActor = useClubScreenActor();
  const formActor = useChildActor<EnterNameActor>(
    clubScreenActor,
    'EnteringName'
  );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formActor && <EnterNameForm formActor={formActor} />}</>;
};
