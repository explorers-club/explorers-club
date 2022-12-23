import { ClubStateSerialized } from '../../type';

export const selectHostUserId = (state: ClubStateSerialized) =>
  state.hostUserId;

export const selectGameRoomId = (state: ClubStateSerialized) =>
  state.gameRoomId;
