import { Card } from '../atoms/Card';
import { Flex } from '../atoms/Flex';
import { Image } from '../atoms/Image';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Box, Button } from '../atoms';
import { Caption } from '../atoms/Caption';
import { FC } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const backgroundImageUrl =
  'https://media.discordapp.net/attachments/1000472333108129935/1064223691719852032/InspectorT_club_house_overlooking_bay_vector_perch_sunset_96e7292b-e069-45eb-b133-01bcdc62bb9c.png?width=896&height=597';

interface Props {
  playerName: string;
}

export const ReservedUpgradeCard: FC<Props> = ({ playerName }) => {
  return (
    <Card css={{ border: '3px solid rgba(23,8,7,1)' }}>
      <Box css={{ position: 'relative' }}>
        <Image
          css={{ aspectRatio: 1, objectFit: 'cover' }}
          src={backgroundImageUrl}
          alt="explorers club sunset"
        />
        <Flex
          justify="end"
          direction="column"
          css={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: '20%',
            p: '$3',
            background: 'linear-gradient(rgba(0,0,0,0), rgba(23,8,7,1))',
          }}
          gap="1"
        >
          <Heading size="3">Become Reserved</Heading>
          <Caption>$10 off in 2023</Caption>
          <Text>Explorers Club Reserved for $25 per year.</Text>
        </Flex>
      </Box>
      <Flex
        css={{ p: '$3', background: 'rgba(23,8,7,1)' }}
        direction="column"
        gap="3"
      >
        <Heading>What You Get</Heading>
        <Flex direction="column" gap="2">
          <Flex gap="2">
            <Box css={{ flexBasis: '$3' }}>
              <ChevronRightIcon color="white" />
            </Box>
            <Text css={{ lineHeight: '125%' }}>
              <Text css={{ fontFamily: '$mono', fontSize: '14px' }}>
                explorers.club/<strong>{playerName}</strong>
              </Text>
            </Text>
          </Flex>
          <Flex gap="2">
            <Box css={{ flexBasis: '$3' }}>
              <ChevronRightIcon color="white" />
            </Box>
            <Text css={{ lineHeight: '125%' }}>
              <strong>{playerName}</strong> player name reserved.
            </Text>
          </Flex>
          <Flex gap="2">
            <Box css={{ flexBasis: '$3' }}>
              <ChevronRightIcon color="white" />
            </Box>
            <Text css={{ lineHeight: '125%' }}>
              <strong>Unlimited score saving</strong> across you and your
              friends in all games you host.
            </Text>
          </Flex>
          <Flex gap="2">
            <Box css={{ flexBasis: '$3' }}>
              <ChevronRightIcon color="white" />
            </Box>
            <Text css={{ lineHeight: '125%' }}>
              <strong>DVR playback</strong>. Automatically save and rewatch your
              favorite game moments
            </Text>
          </Flex>
          <Flex gap="2">
            <Box css={{ flexBasis: '$3' }}>
              <ChevronRightIcon color="white" />
            </Box>
            <Text css={{ lineHeight: '125%' }}>
              <strong>10% off</strong> everything in the Merch store.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify="between" css={{ p: '$3' }}>
        <Flex direction="column" gap="1">
          <Heading>$25 per year</Heading>
          <Caption>Easy to pause</Caption>
        </Flex>
        <Button size="2" css={{ flexBasis: '120px' }}>
          Get Reserved
        </Button>
      </Flex>
    </Card>
  );
};
