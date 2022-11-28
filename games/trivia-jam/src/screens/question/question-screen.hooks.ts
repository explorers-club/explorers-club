import { useChildActor } from '@explorers-club/actor';
import { useContext } from 'react';
import { ScreensContext } from '../screens.context';
import { QuestionScreenActor } from './question-screen.machine';

export const useQuestionScreenActor = () => {
  const { screensActor } = useContext(ScreensContext);
  return useChildActor<QuestionScreenActor>(screensActor, 'Question');
};
