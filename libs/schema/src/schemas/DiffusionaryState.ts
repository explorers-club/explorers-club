import { Schema, ArraySchema, type } from '@colyseus/schema';

export class DiffusionaryState extends Schema {
  @type(['string']) playerUserIds = new ArraySchema<string>();
  @type('number') currentRound = 1;
}
