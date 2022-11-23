import { EnterNameActor, EnterNameForm } from '@organisms/enter-name-form';
import { useChildActor } from '../../../state/utils';
import { useLobbyScreenActor } from './lobby-screen.hooks';

export const EnterNameScreen = () => {
  const actor = useLobbyScreenActor();
  const formActor = useChildActor<EnterNameActor>(
    actor,
    'Connected.Joined.EnteringName'
  );
  return <EnterNameForm formActor={formActor} />;
};
