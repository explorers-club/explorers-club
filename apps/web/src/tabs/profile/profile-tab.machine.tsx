import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { TabMetadata } from '@organisms/tab-bar/tab-bar.types';
import { PersonIcon } from '@radix-ui/react-icons';
import { AuthContextProps } from '../../state/auth.context';

export interface ProfileTabContext {
  userId?: string;
}

export const createProfileTabMachine = (authContextProps: AuthContextProps) =>
  createMachine({
    id: 'ProfileTabMachine',
    type: 'parallel',
    schema: {
      context: {} as ProfileTabContext,
    },
    states: {
      Tab: {
        meta: {
          displayName: 'Profile',
          icon: <PersonIcon />,
        } as TabMetadata,
        initial: 'Visible',
        states: {
          Visible: {},
          Hidden: {},
        },
      },
    },
  });

export type ProfileTabMachine = ReturnType<typeof createProfileTabMachine>;
export type ProfileTabActor = ActorRefFrom<ProfileTabMachine>;
export type ProfileTabState = StateFrom<ProfileTabMachine>;
