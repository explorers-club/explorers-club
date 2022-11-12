import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { Avatar } from '~/web/components/atoms/Avatar';
import { Badge } from '~/web/components/atoms/Badge';
import { Caption } from '~/web/components/atoms/Caption';
import { Card } from '~/web/components/atoms/Card';
import { Flex } from '~/web/components/atoms/Flex';
import { Heading } from '~/web/components/atoms/Heading';
import { Paragraph } from '~/web/components/atoms/Paragraph';
import { Status } from '~/web/components/atoms/Status';
import { Subheading } from '~/web/components/atoms/Subheading';
import { Box } from '../../components/atoms/Box';
import { Text } from '../../components/atoms/Text';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { selectHostPlayerName } from './club-screen.selectors';

export const Claimable = () => {
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
