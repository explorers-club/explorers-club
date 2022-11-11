import { useSelector } from '@xstate/react';
import { Box } from '../../components/atoms/Box';
import { Card } from '../../components/atoms/Card';
import { Heading } from '../../components/atoms/Heading';
import { Image } from '../../components/atoms/Image';
import { Paragraph } from '../../components/atoms/Paragraph';
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
      <Box css={{ maxWidth: 525, mt: 100 }}>
        <Text
          size="5"
          variant="pink"
          css={{ mb: '$4', lineHeight: '25px', fontWeight: 500 }}
        >
          Why Modulz
        </Text>
        <Text size="8" css={{ mb: '$4', lineHeight: '37px', fontWeight: 500 }}>
          Design in the target medium. Prototype with real components.
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
      </Box>
    </Box>
  );
};
