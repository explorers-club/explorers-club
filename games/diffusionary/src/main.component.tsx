import { Flex } from '@atoms/Flex';
import { SharedCollectionActor } from '@explorers-club/actor';
import { FC } from 'react';
import { DiffusionarySharedActor } from './state/diffusionary-shared.machine';

interface Props {
  sharedCollectionActor: SharedCollectionActor;
  sharedActor: DiffusionarySharedActor;
}

export const MainComponent: FC<Props> = ({ sharedCollectionActor, sharedActor }) => {
  return <Flex>Generated main component</Flex>;
};
