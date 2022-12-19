import { createContext } from 'react';
import { TriviaJamRoomService } from './trivia-jam-room.machine';

export const TriviaJamRoomContext = createContext({
  service: {} as TriviaJamRoomService,
  myUserId: '' as string,
});
