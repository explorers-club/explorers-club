import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { useSelector } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { ClubScreen } from '../screens/club';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 20,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export const PlayRoute = () => {
  return <Box>play</Box>;
};
