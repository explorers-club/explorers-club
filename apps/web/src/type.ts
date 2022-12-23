import { RoomStore, SerializedSchema } from '@explorers-club/room';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubRoomCommand } from '@explorers-club/commands';

export type ClubStateSerialized = SerializedSchema<ClubState>;
export type ClubPlayerSerialized = SerializedSchema<ClubPlayer>;

export type ClubStore = RoomStore<ClubState, ClubRoomCommand>;
