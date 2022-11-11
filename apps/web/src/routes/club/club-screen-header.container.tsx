import { useSelector } from '@xstate/react';
import { createSelector } from 'reselect';
import { Text } from '../../components/atoms/Text';
import { useActorLogger } from '../../lib/logging';
import { selectLayoutMetadata } from '../layout.selectors';
import { useClubScreenActor } from './club-screen.hooks';

export const ClubScreenHeader = () => {
  const actor = useClubScreenActor();
  useActorLogger(actor);
  const header = useSelector(actor, selectHeaderMetadata);

  console.log({ header });
  return (
    <Text as="h1" size="8">
      Spectating
    </Text>
  );
};

const selectHeaderMetadata = createSelector(
  selectLayoutMetadata,
  (meta) => meta?.header
);
