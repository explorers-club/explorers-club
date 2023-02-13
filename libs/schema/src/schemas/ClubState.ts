import { MapSchema, SetSchema, Schema, type } from '@colyseus/schema';

export class ClubPlayer extends Schema {
  @type('string') userId!: string;
  @type('string') name = '';
  @type('boolean') connected = true;
  @type('number') slotNumber = 0;
}
export class ClubState extends Schema {
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ set: 'string' }) gameRoomIds: SetSchema<string> = new SetSchema();
  @type('string') conversationId!: string;
  @type('string') clubName!: string;
  @type('string') hostUserId!: string;
  @type('string') selectedGame!:
    | 'trivia_jam'
    | 'diffusionary'
    | 'codebreakers'
    | 'little_vigilante';
  @type({ map: ClubPlayer }) public players: MapSchema<ClubPlayer> =
    new MapSchema<ClubPlayer>();
  @type({ map: 'string' }) gameConfigsSerialized = new MapSchema<string>();
}
