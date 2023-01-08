import { ReactNode } from 'react';

export type TabName = 'Game' | 'Club' | 'Lobby' | 'Profile';

export interface TabMetadata {
  displayName: string;
  icon: ReactNode;
}
