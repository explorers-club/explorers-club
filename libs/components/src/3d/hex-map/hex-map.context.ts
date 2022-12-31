import { createContext } from 'react';
import { ActorRef } from 'xstate';
import { HexMapEvent, HexMapState } from './hex-map.machine';

export const HexMapContext = createContext(
  {} as ActorRef<HexMapEvent, HexMapState>
);
