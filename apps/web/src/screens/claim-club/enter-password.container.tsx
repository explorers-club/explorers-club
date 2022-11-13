import { Box } from '@atoms/Box';
import { FC } from 'react';
import { EnterPasswordActor } from './enter-password.machine';

interface Props {
  actor: EnterPasswordActor;
}

export const EnterPassword: FC<Props> = ({ actor }) => {
  console.log({ actor });
  return <Box>Enter Password</Box>;
};
