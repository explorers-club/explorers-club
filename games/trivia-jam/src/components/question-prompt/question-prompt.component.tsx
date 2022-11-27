import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { FC } from 'react';

interface Props {
  eyebrow: string;
  question: string;
  inputLabel: string;
}

export const QuestionPrompt: FC<Props> = ({
  eyebrow,
  question,
  inputLabel,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Caption>{eyebrow}</Caption>
      <Heading>{question}</Heading>
      <Caption>{inputLabel}</Caption>
      <TextField
        type="text"
        id="email"
        fullWidth={true}
        autoFocus={true}
        css={{ textAlign: 'center' }}
      />
    </Box>
  );
};
