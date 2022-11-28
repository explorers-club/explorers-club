import 'react-spring-bottom-sheet/dist/style.css';
import { ProfileData, QuestionData } from '../src/state/types';
import './global.css';
import { createMockFetchMachine } from './service-mocks';

const fetchProfile = createMockFetchMachine<ProfileData>({
  userId: 'foo',
  name: 'Hi there',
});

const fetchQuestion = createMockFetchMachine<QuestionData>({
  id: 'foo',
  type: 'ClosestValue',
  question: 'How many ounces are in a gallon of milk',
  answer: 128,
});

export const parameters = {
  mockServices: {
    fetchProfile,
    fetchQuestion,
  },
};
