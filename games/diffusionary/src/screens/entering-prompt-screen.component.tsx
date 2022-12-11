import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';
import { TextField } from '@atoms/TextField';
import { FC, FormEventHandler, useCallback, useRef } from 'react';

interface Props {
  onSubmitPrompt: (prompt: string) => void;
}

export const EnteringPromptScreenComponent: FC<Props> = ({
  onSubmitPrompt,
}) => {
  const promptRef = useRef<HTMLInputElement>(null);

  const handleSubmitForm: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onSubmitPrompt(promptRef.current!.value);
    },
    [onSubmitPrompt]
  );

  return (
    <Box css={{ p: '$3', backgroundColor: '$primary1' }}>
      <form onSubmit={handleSubmitForm}>
        <Flex css={{ fd: 'column', gap: '$2', alignItems: 'center' }}>
          <Heading size="2">Enter a prompt</Heading>
          <Subheading size="2">Pick a good one</Subheading>
          <TextField
            ref={promptRef}
            type="text"
            id="prompt"
            placeholder="astronaut riding a horse on mars"
          />
          <Button size="3" fullWidth>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
