import { Schema, type } from '@colyseus/schema';

export class HangoutState extends Schema {
  @type('string') currentSongURL: string | undefined;
}
