import { useSelector } from '@xstate/react';
import { createSelector } from 'reselect';
import { Avatar } from '../../components/atoms/Avatar';
import { Container } from '../../components/atoms/Container';
import { Heading } from '../../components/atoms/Heading';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../components/molecules/Popover';
import { useActorLogger } from '../../lib/logging';
import { Text } from '../../components/atoms/Text';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenState } from './club-screen.machine';
import { Box } from '../../components/atoms/Box';
import { Badge } from '../../components/atoms/Badge';
import { Status } from '../../components/atoms/Status';

export const ClubScreenHeader = () => {
  const actor = useClubScreenActor();
  useActorLogger(actor);

  const clubName = useSelector(actor, selectClubName);

  return (
    <Container>
      <Heading size="2">{clubName}</Heading>
      <Badge size="2" variant="red">
        <Box css={{ mr: '$1', }}>
          <Status size="1" variant="red" />
        </Box>
        Live
      </Badge>
      <Popover>
        <PopoverTrigger asChild>
          <Avatar
            size="2"
            alt="John Smith"
            // src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
            fallback="J"
            variant="crimson" // todo choose a random color
            css={{
              mr: '$1',
            }}
          />
        </PopoverTrigger>
        <PopoverContent css={{ padding: '$3' }}>
          <Text size="2" css={{ lineHeight: '18px' }}>
            {clubName} has X members
          </Text>
        </PopoverContent>
      </Popover>
    </Container>
  );
};

const selectHostPlayerName = (state: ClubScreenState) =>
  state.context.hostPlayerName;

const selectClubName = createSelector(
  selectHostPlayerName,
  (playerName) => `${playerName}'s Explorers Club`
);

// const selectHeaderMetadata = createSelector(
//   selectLayoutMetadata,
//   (meta) => meta?.header
// );
