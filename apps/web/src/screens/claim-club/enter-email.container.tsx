import { Box } from '@atoms/Box';
import { FC } from 'react';
import { EnterEmailActor } from './enter-email.machine';

interface Props {
  actor: EnterEmailActor;
}

export const EnterEmail: FC<Props> = ({ actor }) => {
  console.log({ actor });
  return <Box>Enter Email</Box>;
};
