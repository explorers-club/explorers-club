import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';
import { TextField } from '@atoms/TextField';
import { FC, FormEventHandler, useCallback, useRef } from 'react';
import { EnterNameActor, EnterNameFormEvents } from './enter-name.machine';

interface Props {
  formActor: EnterNameActor;
}

export const EnterName: FC<Props> = ({ formActor }) => {
  const nameRef = useRef<HTMLInputElement>(null);

  // const canSubmit = useSelector(
  //   formActor,
  //   (state) => !state.matches('Editing.Error')
  // );

  const handleChangeName = useCallback(() => {
    formActor.send(
      EnterNameFormEvents.CHANGE({
        name: nameRef.current?.value,
      })
    );
  }, [formActor]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      formActor.send(EnterNameFormEvents.SUBMIT());
      event.preventDefault();
    },
    [formActor]
  );

  return (
    <Box css={{ p: '$3' }}>
      <form onSubmit={handleSubmit}>
        <Flex css={{ fd: 'column', gap: '$2', alignItems: 'center' }}>
          <Heading size="2">Enter a name</Heading>
          <Subheading size="2"></Subheading>
          <TextField
            ref={nameRef}
            type="text"
            id="name"
            placeholder="inspectorT"
            onChange={handleChangeName}
          />
          <Button size="3" color="blue" fullWidth>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
