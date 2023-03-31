// import { trpc } from '@explorers-club/api-client';
// import { Entity, SnowflakeId } from '@explorers-club/schema';
// import { World } from 'miniplex';
// import { createContext, FC, ReactNode, useContext, useState } from 'react';
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

// type EntityStoreState = {
//   entitiesById: Map<SnowflakeId, Entity>;
//   world: World<Entity>;
// };

// type EntityStore = {
//   subscribe: (onChange: (state: EntityStoreState) => void) => () => void;
//   getSnapshot: () => EntityStoreState;
// };

// export const EntityStoreContext = createContext({} as EntityStore);

// export const EntityStoreProvider: FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const { client } = trpc.useContext();
//   const [store] = useState(() => {
//     const state: EntityStoreState = {
//       entitiesById: new Map(),
//       world: new World<Entity>(),
//     };
//     const subscribe = (onChange: (state: EntityStoreState) => void) => {
//       const sub = client.entity.all.subscribe(undefined, {
//         onData(event) {
//           // if (event.type === 'INIT') {
//           //   for (const entity of event.data) {
//           //     state.entitiesById.set(entity.id, entity);
//           //     state.world.add(entity);
//           //   }
//           // }
//           // if (event.type === 'CHANGE') {
//           //   const entity = state.entitiesById.get(event.id);
//           //   if (entity) {
//           //     state.world.update(entity, event.data);
//           //   }
//           // }
//           // if (event.type === 'ADD') {
//           //   state.entitiesById.set(event.id, event.data);
//           //   state.world.add(event.data);
//           // }
//           // if (event.type === 'REMOVE') {
//           //   const entity = state.entitiesById.get(event.id);
//           //   if (entity) {
//           //     state.world.remove(entity);
//           //   }
//           // }
//           onChange(state);
//         },
//       });

//       return sub.unsubscribe;
//     };

//     const getSnapshot = () => state;

//     return {
//       subscribe,
//       getSnapshot,
//     };
//   });

//   return (
//     <EntityStoreContext.Provider value={store}>
//       {children}
//     </EntityStoreContext.Provider>
//   );
// };

// export const useEntityStore = () => {
//   return useContext(EntityStoreContext);
// };

// export const useEntityStoreSelector = <T,>(
//   selector: (state: EntityStoreState) => T
// ) => {
//   const store = useEntityStore();
//   return useSyncExternalStoreWithSelector(
//     store.subscribe,
//     store.getSnapshot,
//     store.getSnapshot,
//     selector
//   );
// };
