import { Schema, ArraySchema, type } from '@colyseus/schema';

export class TriviaJamState extends Schema {
  @type('string')
  hostUserId!: string;

  @type(['string']) playerUserIds = new ArraySchema<string>();
}
