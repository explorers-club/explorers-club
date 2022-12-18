import { MapSchema, Schema, type } from '@colyseus/schema';

export class ClubPlayer extends Schema {
  @type('string') name!: string;
  @type('boolean') connected = true;
}

export class ClubState extends Schema {
  @type('string') hostSessionId: string | undefined;
  @type('string') gameRoomId: string | undefined;
  @type('string') selectedGame: 'trivia_jam' | 'diffusionary' | undefined;
  @type({ map: ClubPlayer }) public players: MapSchema<ClubPlayer> =
    new MapSchema<ClubPlayer>();
}
