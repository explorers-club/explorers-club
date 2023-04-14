import { Entity } from '@explorers-club/schema';
import { TRPCError } from '@trpc/server';
import * as JWT from 'jsonwebtoken';

export const getSessionId = (accessToken: string) => {
  const parsedAccessToken = JWT.decode(accessToken);
  if (
    typeof parsedAccessToken === 'object' &&
    parsedAccessToken &&
    'session_id' in parsedAccessToken
  ) {
    return parsedAccessToken['session_id'];
  }
  return null;
};

export const waitFor = <TEntity extends Entity>(
  entity: TEntity,
  condition: (entity: TEntity) => boolean,
  timeoutMs = 10000
) =>
  new Promise<TEntity>((resolve, reject) => {
    setTimeout(() => {
      unsub();
      reject(
        new TRPCError({
          code: 'TIMEOUT',
          message: 'Timed out waiting for entity ' + entity,
        })
      );
    }, timeoutMs);
    const unsub = entity.subscribe((event) => {
      console.log(event.type, entity);
      if (condition(entity)) {
        resolve(entity);
        unsub();
        return true;
      }
      return false;
    });
  });
