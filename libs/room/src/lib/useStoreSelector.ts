import { Schema } from '@colyseus/schema';
import { deepEqual } from '@explorers-club/utils';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { RoomStore, SerializedSchema } from '../index';

export const useStoreSelector = <TSchema extends Schema, TCommand, T>(
  store: RoomStore<TSchema, TCommand>,
  selector: (state: SerializedSchema<TSchema>) => T
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selector,
    deepEqual
  );
};
