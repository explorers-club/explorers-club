import { ArraySchema, SetSchema, Schema, type } from '@colyseus/schema';

export class ChatState extends Schema {
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ set: 'string' }) chatId: SetSchema<string> = new SetSchema();
  @type({ array: 'string' }) messagesSerialized = new ArraySchema<string>();
}
