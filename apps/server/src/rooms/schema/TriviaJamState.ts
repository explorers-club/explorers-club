import { Schema, type } from '@colyseus/schema';

export class TriviaJamState extends Schema {
  @type('string') mySynchronizedProperty: string = 'Hello world';
}
