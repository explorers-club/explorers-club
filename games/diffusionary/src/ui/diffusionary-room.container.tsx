import { DiffusionaryStore } from '@explorers-club/room';
import { FC } from 'react';
import { DiffusionaryContext } from '../state/diffusionary.context';
import { DiffusionaryRoomComponent } from './diffusionary-room.component';

interface Props {
  store: DiffusionaryStore;
  myUserId: string;
}

export const DiffusionaryRoom: FC<Props> = ({ store, myUserId }) => {
  return (
    <DiffusionaryContext.Provider value={{ store, myUserId }}>
      <DiffusionaryRoomComponent />
    </DiffusionaryContext.Provider>
  );
};
