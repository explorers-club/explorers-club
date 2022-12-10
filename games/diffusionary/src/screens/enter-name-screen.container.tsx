import { selectMyActor } from '@explorers-club/actor';
import { EnterNameForm, enterNameMachine } from '@organisms/enter-name-form';
import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { MainContext } from '../main.context';
import {
  DiffusionaryPlayerActor,
  DiffusionaryPlayerEvents,
} from '../state/diffusionary-player.machine';
import { useSubscription } from 'observable-hooks';
import { filter, from, map, take } from 'rxjs';

export const EnterNameScreen = () => {
  const actor = useInterpret(enterNameMachine);
  const onCompleteForm$ = useMemo(
    () =>
      from(actor).pipe(
        filter((state) => state.matches('Success')),
        map((state) => state.event),
        take(1)
      ),
    [actor]
  );
  const { sharedCollectionActor } = useContext(MainContext);

  const myActor = useSelector(
    sharedCollectionActor,
    selectMyActor<DiffusionaryPlayerActor>
  );

  // console.log(actor$);

  useSubscription(onCompleteForm$, (event) => {
    const { name } = actor.getSnapshot().context.values;
    myActor?.send(DiffusionaryPlayerEvents.SET_PLAYER_NAME(name));
  });

  return <EnterNameForm formActor={actor} />;
};
