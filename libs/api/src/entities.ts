import { Entity, EntityService, SnowflakeId } from '@explorers-club/schema';
import { filter, from, Observable, Subject, take } from 'rxjs';
import { AnyInterpreter, Interpreter } from 'xstate';

type EntityServiceEvent =
  | { type: 'ADD'; service: AnyInterpreter; entityId: SnowflakeId }
  | { type: 'REMOVE'; entityId: SnowflakeId; service: AnyInterpreter };

const entityServicesSubject = new Subject<EntityServiceEvent>();

const entityServicesMap = new Map<SnowflakeId, AnyInterpreter>();

export const entity$ = entityServicesSubject as Observable<EntityServiceEvent>;

export const getEntityService = async <
  TInterpreter extends Interpreter<any, any, any, any>
>(
  id: SnowflakeId
) => {
  type Context<TContext> = TInterpreter extends Interpreter<infer U>
    ? U
    : TContext;
  type State<TContext> = TInterpreter extends Interpreter<any, any, infer U>
    ? U
    : TContext;
  type Event<TContext> = TInterpreter extends Interpreter<any, any, infer U>
    ? U
    : TContext;
  type TypeState<TContext> = TInterpreter extends Interpreter<
    any,
    any,
    any,
    infer U
  >
    ? U
    : TContext;

  let service = entityServicesMap.get(id) as
    | Interpreter<
        Context<TInterpreter>,
        State<TInterpreter>,
        Event<TInterpreter>,
        TypeState<TInterpreter>
      >
    | undefined;

  if (service) {
    return service;
  }

  // todo add a timeout in case it never shows up
  service = await new Promise((resolve) =>
    from(entity$)
      .pipe(
        filter((event) => !!event.service.getSnapshot().context.entity),
        take(1)
      )
      .subscribe((event) => {
        resolve(event.service);
      })
  );

  return service;
};

export const registerEntityService = <TContext extends { entity?: Entity }>(
  service: Interpreter<TContext, any, any, any, any>
) => {
  let entityId: SnowflakeId | undefined;
  const sub = service.subscribe((state) => {
    const entity = state.context.entity;
    if (!entityId && entity) {
      entityId = entity.id;
      entityServicesMap.set(entityId, service);
      entityServicesSubject.next({ type: 'ADD', service, entityId });
    } else if (entityId && !state.context.entity) {
      entityServicesMap.delete(entityId);
      entityServicesSubject.next({ type: 'REMOVE', service, entityId });
      entityId = undefined;
      sub.unsubscribe();
    }
  });
};
