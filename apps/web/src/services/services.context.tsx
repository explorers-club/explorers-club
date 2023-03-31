import { trpc } from '@explorers-club/api-client';
import { useInterpret } from '@xstate/react';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { merge, Observable, Subject } from 'rxjs';
import { AnyActorRef, AnyInterpreter } from 'xstate';
import { ZodSchema } from 'zod';
import {
  AppEventSchema,
  ServiceEvent,
  ServiceKey,
  ServiceMap,
} from '../schema';
import { createAppMachine } from '../state/app.machine';
import { LobbyEventSchema } from '../state/lobby.machine';
import { WorldContext } from '../state/world.context';
import { getClubNameFromPath } from '../utils';

interface ServiceGateway {
  services: ServiceMap;
  send: (event: ServiceEvent) => void;
  register: (service: ServiceKey, interpreter: AnyInterpreter) => void;
  unregister: (service: ServiceKey) => void;
  event$: Observable<ServiceEvent>;
  services$: Observable<ServiceMap>;
  all$: Observable<ServiceMap | ServiceEvent>;
}

export const ServicesContext = createContext({} as ServiceGateway);

export const ServicesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [event$] = useState(new Subject<ServiceEvent>());
  const [services$] = useState(new Subject<ServiceMap>());
  const [all$] = useState(merge(event$, services$));
  const activeRoom = getClubNameFromPath();
  const { client: trpcClient } = trpc.useContext();
  const { world } = useContext(WorldContext);

  const [appMachine] = useState(
    createAppMachine({ trpcClient, world, activeRoom })
  );
  const appService = useInterpret(appMachine);
  const [services] = useState({
    appService,
  } as ServiceMap);

  const send = useCallback(
    (event: ServiceEvent) => {
      parseAndSend(AppEventSchema, event, services.appService);
      parseAndSend(LobbyEventSchema, event, services.lobbyService);

      event$.next(event);
    },
    [services, event$]
  );

  const register = useCallback(
    <T extends ServiceKey>(
      service: T,
      interpreter: Exclude<ServiceMap[T], undefined>
    ) => {
      interpreter.start();
      services[service] = interpreter;
      services$.next(services);
    },
    [services, services$]
  );

  const unregister = useCallback(
    (service: ServiceKey) => {
      const interpreter = services[service];
      if (interpreter) {
        interpreter.stop();
        delete services[service];
      }
      services$.next(services);
    },
    [services, services$]
  );

  return (
    <ServicesContext.Provider
      value={{ send, services, register, unregister, event$, services$, all$ }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

const parseAndSend = <TService extends AnyActorRef, TSchema extends ZodSchema>(
  schema: TSchema,
  event: ServiceEvent,
  service?: TService
) => {
  const result = schema.safeParse(event);
  if (service && result.success) {
    service.send(result.data);
  }
};
