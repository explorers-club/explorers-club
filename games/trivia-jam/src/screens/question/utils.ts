import { IQuestionFields, IQuestion } from "../../state/trivia-jam-shared.machine";

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
