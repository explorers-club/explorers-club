import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { FC, FormEventHandler, useCallback, useRef } from 'react';

interface Props {
  fields: INumberInputFields;
  onSubmitResponse: (response: number) => void;
}

export const NumberInputQuestionComponent: FC<Props> = ({
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

      const response = parseFloat(responseRef.current.value);
      onSubmitResponse(response);
    },
    [responseRef, onSubmitResponse]
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Enter a number</Caption>
      <Heading size="2">{prompt}</Heading>
      <Flex direction="column" gap="3">
        <TextField
          ref={responseRef}
          name="response"
          type="number"
          onChange={handleChange}
        />
      </Flex>
    </Flex>
  );
};
