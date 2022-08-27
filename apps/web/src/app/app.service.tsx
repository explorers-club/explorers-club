import { createContext } from 'react';
import { AppActor } from './app.machine';

export const AppServiceContext = createContext<AppActor>({} as AppActor);
