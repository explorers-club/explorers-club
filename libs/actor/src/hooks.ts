import { useSelector } from '@xstate/react';
import { AnyActorRef } from 'xstate';

// export const useSelectActors = (
//   actorManager: ActorManager,
//   { actorType }: { actorType: ActorType }
// ) => {
//   const [actors, setActors] = useState<AnyActorRef[]>(
//     actorManager.getActorsForType(actorType)
//   );

//   useEffect(() => {
//     const handleHydrate = () => {
//       setActors(actorManager.getActorsForType(actorType));
//     };

//     actorManager.on('HYDRATE', handleHydrate);

//     return () => {
//       actorManager.off('HYDRATE', handleHydrate);
//     };
//   }, [actorManager, actorType]);

//   return actors;
// };

export function useChildActor<T>(actor: AnyActorRef, stateKey: string) {
  const childKeys = useSelector(actor, (state) => Object.keys(state.children));
  const regex = RegExp(`${stateKey}:invocation\\[0\\]`);
  const key = childKeys.find((key) => key.match(regex));

  return useSelector(
    actor,
    (state) => key && (state.children[key] as T | undefined)
  ) as T;
}
