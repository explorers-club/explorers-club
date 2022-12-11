import React from 'react';
import { Flex } from '@atoms/Flex';
import { TextField } from '@atoms/TextField';
import { Caption } from '@atoms/Caption';
import { Heading } from '@atoms/Heading';

export const GuessingScreenComponent = () => {
  return (
    <Flex css={{ p: '$3' }} direction="column" gap="3">
      <Heading>Images are appearing...</Heading>
      <Caption>Enter words you think were used to generate them</Caption>
      <TextField />
    </Flex>
  );
};
