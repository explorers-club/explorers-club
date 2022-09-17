
// const selectChildren = (state: PartyState) => state.getSnapshot()

// const selectPartyActorChildren = createSelector(
//   selectPartyActor,
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   (actor) => actor?.getSnapshot()!.children
// );

// export const selectLobbyActor = createSelector(selectParty

// export const selectGameActor = createSelector(
//   selectChildren,
//   (children) => children['gameActor'] as GameActor | undefined
// );

// export const selectLobbyPlayers = createSelector(
//   selectLobbyActor,
//   (lobbyActor, userId) =>
//     lobbyActor
//       ?.getSnapshot()
//       ?.context.lobbyPlayers
// );

// export const selectLobbyPlayer = createSelector(
//   [selectLobbyActor, (_, userId) => userId],
//   (lobbyActor, userId) =>
//     lobbyActor
//       ?.getSnapshot()
//       ?.context.lobbyPlayers.find(
//         (player) => player.getSnapshot()?.context.userId === userId
//       )
// );
