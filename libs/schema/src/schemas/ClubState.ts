import { MapSchema, Schema, type } from '@colyseus/schema';

export class ClubPlayer extends Schema {
  @type('string') userId!: string;
  @type('string') name!: string;
  @type('boolean') connected = true;
}

export class ClubState extends Schema {
  @type('string') hostUserId!: string;
  @type('string') gameRoomId: string | undefined;
  @type('string') selectedGame!: 'trivia_jam' | 'diffusionary';
  @type({ map: ClubPlayer }) public players: MapSchema<ClubPlayer> =
    new MapSchema<ClubPlayer>();
}
