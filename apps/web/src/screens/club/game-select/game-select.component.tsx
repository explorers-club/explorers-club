import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';

export const GameSelectComponent = () => {
  return (
    <Flex
      css={{
        fd: 'column',
        height: '100%',
        maxHeight: '240px',

        justifyContent: 'flex-end',
        width: '100%',
        p: '$5',
        aspectRatio: 1,
        bc: '$crimson9',
      }}
    >
      <Heading size="3" css={{ color: '$gray1' }}>
        Trivia Jam
      </Heading>
      <Subheading css={{ color: '$gray2' }}>
        Play some trivia with friends
      </Subheading>
    </Flex>
  );
};
