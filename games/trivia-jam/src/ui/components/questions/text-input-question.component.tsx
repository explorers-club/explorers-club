import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { FC, FormEventHandler, useCallback, useRef } from 'react';

interface Props {
  fields: ITextInputFields;
  onSubmitResponse: (response: string) => void;
}

export const TextInputQuestionComponent: FC<Props> = ({
  fields,
  onSubmitResponse,
}) => {
  const { prompt } = fields;
  const responseRef = useRef<HTMLInputElement>(null);

  const handleChange: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      if (!responseRef.current) {
        return;
      }

      const response = responseRef.current.value;
      onSubmitResponse(response);
    },
    [responseRef, onSubmitResponse]
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Enter a guess</Caption>
      <Heading size="2">{prompt}</Heading>
      <Flex direction="column" gap="3">
        <TextField ref={responseRef} name="response" onChange={handleChange} />
      </Flex>
    </Flex>
  );
};
