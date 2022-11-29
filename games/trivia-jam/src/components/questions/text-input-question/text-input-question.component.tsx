import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import type { ITextInputFields } from '@explorers-club/contentful-types';

export const TextInputQuestion: FC<ITextInputFields> = ({ question }) => {
  return (
    <Flex>
      <Heading size="4">{question}</Heading>
    </Flex>
  );
};
