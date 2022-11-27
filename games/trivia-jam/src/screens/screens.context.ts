import { createContext } from 'react';
import { ScreensActor } from './screens.machine';

export const ScreensContext = createContext({
  screensActor: {} as ScreensActor,
});
