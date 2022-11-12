import { useSelector } from '@xstate/react';
import { Caption } from '~/web/components/atoms/Caption';
import { Card } from '~/web/components/atoms/Card';
import { Box } from '../../components/atoms/Box';
import { Text } from '../../components/atoms/Text';
import { useClubScreenActor } from './club-screen.hooks';
import { selectHostPlayerName } from './club-screen.selectors';

export const Claimable = () => {
  const actor = useClubScreenActor();
  const playerName = useSelector(actor, selectHostPlayerName);

  return (
    <Box css={{ p: '$4' }}>
      {/* <Card variant="interactive">
        <Image src="https://images.asos-media.com/products/aape-by-a-bathing-ape-camo-detail-windbreaker-in-green/23274265-1-green?$XXL$&wid=513&fit=constrain" />
        <Box css={{ p: '$3' }}>
          <Heading>{playerName}'s explorers club is unclaimed</Heading>
          <Paragraph>Make it yours</Paragraph>
        </Box>
      </Card> */}
      <Card variant="interactive">
        <Caption
          css={{
            mb: '$4',
          }}
        >
          {playerName}'s Explorers Club
        </Caption>
        <Text size="8" css={{ mb: '$4', lineHeight: '37px', fontWeight: 500 }}>
          {playerName} is available
        </Text>
        {/* <Text size="4" css={{ mb: '$3', lineHeight: '25px', pr: '$9' }}>
          Create an account to claim{' '}
          <Text css={{ fontFamily: '$mono' }}>explorers.club/{playerName}</Text>{' '}
          as your hub for playing games with friends and family.
        </Text> */}
      </Card>
    </Box>
  );
};
