import { useSelector as useXstateSelector } from '@xstate/react';
import { useCallback, useContext } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { RequiredServices, ServiceMap, ServiceState } from '../schema';
import { ServicesContext } from './services.context';

export const useAppSend = () => {
  const { send } = useContext(ServicesContext);
  return send;
};

export const useSelector = <T>(selector: (state: ServiceState) => T) => {
  const { services, all$ } = useContext(ServicesContext);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const sub = all$.subscribe(onStoreChange);

      return () => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      };
    },
    [all$]
  );

  const getSnapshot = useCallback(() => {
    return getObjectSnapshots(services);
  }, [services]);

  return useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getSnapshot,
    selector
  );
};

export const useService = <T extends RequiredServices, S>(
  serviceKey: T,
) => {
  const { services } = useContext(ServicesContext);
  return services[serviceKey];
};

export const useServiceSelector = <T extends RequiredServices, S>(
  serviceKey: T,
  selector: (state: ReturnType<ServiceMap[T]['getSnapshot']>) => S
) => {
  const service = useService(serviceKey);
  return useXstateSelector(service, selector);
};

type Snapshotable<T> = {
  getSnapshot(): T;
};

type ObjectSnapshots<T> = {
  [K in keyof T]: T[K] extends Snapshotable<any>
    ? ReturnType<T[K]['getSnapshot']>
    : never;
};

function getObjectSnapshots<T extends Record<string, Snapshotable<any>>>(
  obj: T
): ObjectSnapshots<T> {
  const result: Partial<ObjectSnapshots<T>> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key].getSnapshot();
    }
  }

  return result as ObjectSnapshots<T>;
}
