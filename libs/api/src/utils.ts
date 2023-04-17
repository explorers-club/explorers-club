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
    if (condition(entity)) {
      resolve(entity);
      return;
    }

    const timer = setTimeout(() => {
      unsub();
      reject(
        new TRPCError({
          code: 'TIMEOUT',
          message: 'Timed out waiting for entity ' + entity,
        })
      );
    }, timeoutMs);
    clearTimeout(timer);
    // console.log('SET UP TIMEOUT', timeout);
    const unsub = entity.subscribe((s) => {
      // console.log('EVENT!', s, condition(entity));
      if (condition(entity)) {
        clearTimeout(timer);
        resolve(entity);
        unsub();
        return true;
      }
      return false;
    });
  });
