import { IQuestionSetFields } from '@explorers-club/contentful-types';

type Unarray<T> = T extends Array<infer U> ? U : T;

export type IQuestion = Unarray<IQuestionSetFields['questions']>;
export type IQuestionFields = IQuestion['fields'];
export type IQuestionType = IQuestion['sys']['contentType']['sys']['id'];