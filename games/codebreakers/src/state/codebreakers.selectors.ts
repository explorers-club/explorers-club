import { CodebreakersStateSerialized } from "@explorers-club/room";

export const selectWinningTeam = (state: CodebreakersStateSerialized) => {
  const { board, tripWord } = state;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tripWordBoardItem = board.find(({ word }) => word === tripWord)!;
  if (tripWordBoardItem.guessedBy !== '') {
    return tripWordBoardItem.guessedBy === 'A' ? 'B' : 'A';
  }

  const teamAWon =
    board.filter(
      (boardItem) => boardItem.belongsTo === 'A' && boardItem.guessedBy !== ''
    ).length === 9;

  const teamBWon =
    board.filter(
      (boardItem) => boardItem.belongsTo === 'B' && boardItem.guessedBy !== ''
    ).length === 8;

  if (teamAWon) {
    return 'A';
  } else if (teamBWon) {
    return 'B';
  }
  return null;
};