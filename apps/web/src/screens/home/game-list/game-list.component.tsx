import { Avatar } from '@atoms/Avatar';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Box } from '@atoms/Box';
import { PersonIcon } from '@radix-ui/react-icons';
import { Heading } from '@atoms/Heading';

export const GameList = () => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Caption
          css={{ color: '$gray11', textTransform: 'uppercase', mb: '$2' }}
        >
          Now playing
        </Caption>
        <Heading size="3" css={{ my: '$2' }}>
          Live Games
        </Heading>
        <Flex css={{ gap: '$2', fd: 'column' }}>
          {Array.from({ length: 8 }).map((_, i) => {
            return <GameListItemPlaceholder key={i} />;
          })}
        </Flex>
      </Card>
    </Box>
  );
};

export const GameListItemPlaceholder = () => {
  return (
    <Flex css={{ gap: '$3', alignItems: 'center' }}>
      <Avatar size="3" fallback={<PersonIcon color="var(--colors-gray9)" />} />
      <Text size="4">Empty</Text>
    </Flex>
  );
};
