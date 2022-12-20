import { interval, take, map } from 'rxjs';
import { IQuestionFields, IQuestion } from '../types';

export const unwrapFields = <
  T extends IQuestionFields,
  K extends string = string
>(
  question: IQuestion,
  expectedType: K
): T => {
  if (question.sys.contentType.sys.id !== expectedType)
    throw Error(`failed attempt to unwrap content type ${expectedType}`);

  return question.fields as T;
};

export const unwrapQuestionData = <
  T extends IQuestionFields,
  K extends string = string
>(
  question: IQuestion,
  expectedType: K
): { type: K; fields: T } => {
  if (question.sys.contentType.sys.id !== expectedType)
    throw Error(`failed attempt to unwrap content type ${expectedType}`);

  return { type: expectedType, fields: question.fields as T };
};

export const createCountdown$ = (seconds: number) =>
  interval(1000).pipe(
    take(seconds + 1),
    map((count) => seconds - count)
  );
