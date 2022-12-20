import { contentfulClient } from '@explorers-club/contentful';
import { ComponentStory, Meta } from '@storybook/react';
import { Entry } from 'contentful';
import React from 'react';
import { IQuestion, IQuestionFields } from '../types';
import { QuestionScreenComponent } from './question-screen.component';

export default { component: QuestionScreenComponent } as Meta;

export const Primary: ComponentStory<typeof QuestionScreenComponent> = (
  args,
  { loaded }
) => {
  const question = loaded['question'] as IQuestion;
  return <QuestionScreenComponent question={question} />;
};

const sampleEntryId = '70AalDeTL99Cpyx5KLW0KM';

Primary.loaders = [
  async () => ({
    question: await contentfulClient.getEntry<IQuestionFields>(sampleEntryId),
  }),
];
