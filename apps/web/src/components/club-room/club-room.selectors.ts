import { ClubRoomState } from './club-room.machine';

export const selectRoom = (state: ClubRoomState) => state.context.room;
