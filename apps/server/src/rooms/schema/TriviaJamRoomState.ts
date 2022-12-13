import { Schema, Context, type } from '@colyseus/schema';

export class TriviaJamRoomState extends Schema {
  @type('string') mySynchronizedProperty: string = 'Hello world';
}
