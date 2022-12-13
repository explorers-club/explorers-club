import { MapSchema, Schema, type } from '@colyseus/schema';

export class HangoutState extends Schema {
  @type('string') currentSongURL: string | undefined;
  @type('string') selectedGame: 'trivia_jam' | 'diffusionary' | undefined;
  @type({ map: 'string' }) public playerNames: MapSchema<string> =
    new MapSchema<string>();
}
