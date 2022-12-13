import { createContext } from 'react';
import * as Colyseus from 'colyseus.js';

export const ColyseusContext = createContext({} as Colyseus.Client);
