import { useSelector } from '@xstate/react';
import { Caption } from '~/web/components/atoms/Caption';
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
      <Box>
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
        <Text size="4" css={{ mb: '$3', lineHeight: '25px', pr: '$9' }}>
          Almost all design tools are optimised for illustration. Drawing tools
          are great for exploration but when it comes to designing websites,
          apps, and user interfaces, we need something more powerful.
        </Text>
        <Text size="3" variant="gray" css={{ lineHeight: '23px' }}>
          It is exceptionally hard to have a great design tool that outputs
          useful code. Many have tried but in the end the trade offs were too
          great. That was until Modulz made it their mission.
        </Text>
        <Text css={{ fontFamily: '$mono' }}>cool cool</Text>
      </Box>
    </Box>
  );
};
