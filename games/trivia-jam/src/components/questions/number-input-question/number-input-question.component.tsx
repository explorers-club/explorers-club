import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import type { INumberInputFields } from '@explorers-club/contentful-types';

export const NumberInputQuestion: FC<INumberInputFields> = ({ question }) => {
  return (
    <Flex>
      <Heading size="4">{question}</Heading>
    </Flex>
  );
};
