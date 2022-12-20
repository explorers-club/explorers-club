import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { FC, FormEventHandler, useCallback, useRef } from 'react';

interface Props {
  prompt: string;
  onSubmitResponse: (response: number) => void;
}

export const NumberInputQuestionComponent: FC<Props> = ({
  prompt,
  onSubmitResponse,
}) => {
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
    <Flex direction="column" gap="2">
      <Caption>Number question</Caption>
      <Heading size="3">{prompt}</Heading>
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
