import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { ClubScreenEvents } from '../club-screen.machine.old';
import { selectHostPlayerName } from '../club-screen.selectors';

export const ClaimableScreen = () => {
  const actor = useClubScreenActor();
  const playerName = useSelector(actor, selectHostPlayerName);

  const handlePressCard = useCallback(() => {
    actor.send(ClubScreenEvents.PRESS_CLAIM());
  }, [actor]);

  return (
    <Box css={{ p: '$4' }}>
      <Card color="teal" variant="interactive" onClick={handlePressCard}>
        <Box css={{ p: '$4' }}>
          <Heading
            size="3"
            css={{
              color: 'white',
              textTransform: 'capitalize',
              mt: '$9',
              mb: '$2',
            }}
          >
            {playerName}'s
            <br />
            Explorers Club
          </Heading>
          <Subheading css={{ color: 'white' }}>
            Start a club to host games
            <br />
            with friends and family.
          </Subheading>
        </Box>
        <Flex
          css={{
            bc: 'white',
            p: '$4',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Flex css={{ gap: '$3' }}>
            <Avatar fallback={playerName[0]} variant="crimson" size="3" />
            <Flex css={{ fd: 'column' }}>
              <Caption css={{ color: '$gray10' }}>Available</Caption>
              <Heading size="2" css={{ color: '$gray12' }}>
                {playerName}
              </Heading>
            </Flex>
          </Flex>
          <Badge variant="crimson" size="2" interactive>
            Claim
            <Box css={{ ml: 5 }}>
              <ArrowRightIcon />
            </Box>
          </Badge>
        </Flex>
      </Card>
    </Box>
  );
};
