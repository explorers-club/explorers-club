import { useSelector } from '@xstate/react';
import { createSelector } from 'reselect';
import { Button } from '../../components/atoms/Button';
import { selectLayoutMetadata } from '../layout.selectors';
import { useClubScreenActor } from './club-screen.hooks';

export const ClubScreenFooter = () => {
  const actor = useClubScreenActor();
  const footer = useSelector(actor, selectHeaderMetadata);

  console.log({ footer });
  return (
    <Button fullWidth size="3">
      Join Party
    </Button>
  );
};

const selectHeaderMetadata = createSelector(
  selectLayoutMetadata,
  (meta) => meta?.footer
);