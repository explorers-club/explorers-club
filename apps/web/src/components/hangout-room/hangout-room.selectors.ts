import { HangoutRoomState } from './hangout-room.machine';

export const selectRoom = (state: HangoutRoomState) => state.context.room;
