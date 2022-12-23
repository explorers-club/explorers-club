import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { TriviaJamStateSerialized } from '../types';
import { createSelector } from 'reselect';

export const selectAllPlayersConnected = (state: TriviaJamState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0 && state.hostPlayer.connected;
};

export const selectHostUserId = (state: TriviaJamStateSerialized) => {
  return state.hostPlayer.userId;
};

export const selectCurrentQuestionPoints = (state: TriviaJamStateSerialized) =>
  state.currentQuestionPoints;

export const selectPlayers = (state: TriviaJamStateSerialized) => {
  return Object.values(state.players).filter(
    (player) => player.userId !== state.hostPlayer.userId
  );
};

export const selectCurrentStates = (state: TriviaJamStateSerialized) =>
  state.currentStates;

export const selectCurrentResponsesSerialized = (state: TriviaJamState) =>
  state.currentResponsesSerialized;

export const selectCurrentQuestionPointsByName = createSelector(
  selectPlayers,
  selectCurrentQuestionPoints,
  (players, currentQuestionPoints) => {
    const currentQuestionPointsByName: Partial<Record<string, number>> = {};

    Object.values(players).forEach((player) => {
      currentQuestionPointsByName[player.name] =
        currentQuestionPoints[player.userId];
    });

    return currentQuestionPointsByName;
  }
);

export const selectResponsesByPlayerName = <TResponseType>(
  state: TriviaJamStateSerialized
) => {
  const responsesByPlayerName: Partial<Record<string, TResponseType>> = {};
  Object.values(state.players).forEach((player, userId) => {
    const response = state.currentResponsesSerialized[player.userId];
    if (response) {
      try {
        responsesByPlayerName[player.name] = JSON.parse(response);
      } catch (ex) {
        console.warn("couldn't parse response", response);
      }
    } else {
      responsesByPlayerName[player.name] = undefined;
    }
  });
  return responsesByPlayerName;
};
