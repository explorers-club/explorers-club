import { AuthState } from './auth.machine';
import { createSelector } from 'reselect';

export const selectAuthIsInitalized = (state: AuthState) =>
  state.matches('Authenticated') || state.matches('Unauthenticated');

const selectAuthContext = (state: AuthState) => state.context;

const selectAuthSession = createSelector(
  selectAuthContext,
  (context) => context.session
);

export const selectUser = createSelector(
  selectAuthSession,
  (session) => session?.user
);

const selectUserProfile = createSelector(
  selectAuthContext,
  (context) => context.profile
);

export const selectPlayerName = createSelector(
  selectUserProfile,
  (profile) => profile?.player_name
);

const selectUserEmail = createSelector(selectUser, (user) => user?.email);

const selectUserNewEmail = createSelector(
  selectUser,
  (user) => user?.new_email
);

export const selectIsAnonymous = createSelector(
  selectUserEmail,
  selectUserNewEmail,
  (email, newEmail) => {
    if (newEmail || (email && !email.match('@anon-users.explorers.club'))) {
      return false;
    }

    return true;
  }
);

export const selectClubName = createSelector(
  selectPlayerName,
  (playerName) => `${playerName} Explorers Club`
);

export const selectUserMetdata = createSelector(
  selectUser,
  (user) => user?.user_metadata
);

export const selectHasPasswordSet = createSelector(
  selectUserMetdata,
  (metadata) => metadata && metadata['has_password']
);
