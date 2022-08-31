import { createContext } from 'react';
import { HomeActor } from './home.machine';

export const HomeServiceContext = createContext<HomeActor>({} as HomeActor);
