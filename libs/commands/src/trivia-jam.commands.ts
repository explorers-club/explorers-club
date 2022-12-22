import { JoinCommand, ContinueCommand, LeaveCommand } from './common.commands';

export const TRIVIA_JAM_SUBMIT_RESPONSE = 'TRIVIA_JAM_SUBMIT_RESPONSE';

export type QuestionResponse = string[] | string | number | boolean | undefined;

export type TriviaJamSubmitResponseCommand = {
  type: typeof TRIVIA_JAM_SUBMIT_RESPONSE;
  response: QuestionResponse;
};

export type TriviaJamCommand =
  | ContinueCommand
  | JoinCommand
  | LeaveCommand
  | TriviaJamSubmitResponseCommand;
