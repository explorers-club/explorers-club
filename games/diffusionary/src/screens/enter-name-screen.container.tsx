import { EnterNameForm, enterNameMachine } from '@organisms/enter-name-form';
import { useInterpret } from '@xstate/react';
import { useEffect } from 'react';

export const EnterNameScreen = () => {
  const formActor = useInterpret(enterNameMachine);

  useEffect(() => {
    formActor.subscribe((state) => {
      console.log(state);
    });
  }, [formActor]);

  return <EnterNameForm formActor={formActor} />;
};
