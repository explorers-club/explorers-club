import { useChildActor } from '@explorers-club/actor';
import { useContext } from 'react';
import { ScreensContext } from '../screens.context';
import { ScoreboardScreenActor } from './scoreboard-screen.machine';

export const useScoreboardScreenActor = () => {
  const { screensActor } = useContext(ScreensContext);
  return useChildActor<ScoreboardScreenActor>(screensActor, 'Scoreboard');
};
