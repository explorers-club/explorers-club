import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

const selectAuthActor = createSelector(
  selectAppContext,
  (context) => context.authActor
);

const selectAuthState = createSelector(selectAuthActor, (actorRef) =>
  actorRef.getSnapshot()
);

const selectUserId = createSelector(
  selectAuthState,
  (authState) => authState?.context.user?.id
);

export const selectIsLoggedIn = createSelector(
  selectUserId,
  (userId) => !!userId
);
