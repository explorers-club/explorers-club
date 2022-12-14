import { createContext } from 'react';
import { HangoutRoomService } from './hangout-room.machine';

export const HangoutRoomContext = createContext({} as HangoutRoomService);
