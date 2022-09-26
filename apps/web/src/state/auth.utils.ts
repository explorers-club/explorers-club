import { from, filter, first } from 'rxjs';
import { AuthActor, AuthEvents } from './auth.machine';

export const createAnonymousUser = async (authActor: AuthActor) =>
  new Promise((resolve, reject) => {
    from(authActor)
      .pipe(
        filter((state) => state.matches('Authenticated')),
        first()
      )
      .subscribe(resolve);
    // TODO cleanup observable subscriptions?
    from(authActor)
      .pipe(
        filter((state) => state.matches('Unauthenticated.Error')),
        first()
      )
      .subscribe(reject);
    authActor.send(AuthEvents.CREATE_ANONYMOUS_USER());
  });
