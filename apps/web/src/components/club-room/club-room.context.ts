import { createContext } from 'react';
import { ClubRoomService } from './club-room.machine';

export const ClubRoomContext = createContext({} as ClubRoomService);
