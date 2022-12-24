import { ClubStateSerialized } from '@explorers-club/room';

export const selectHostUserId = (state: ClubStateSerialized) =>
  state.hostUserId;

export const selectGameRoomId = (state: ClubStateSerialized) =>
  state.gameRoomId;
