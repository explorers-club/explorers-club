import { Flex } from '@atoms/Flex';
import { Image } from '@atoms/Image';
import { Box } from '@atoms/Box';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import {
  CenterContent,
  LeftContent,
  BackContent,
  RightContent,
  RotatableCard,
} from '@molecules/RotatableCard';
import { Avatar } from '@radix-ui/react-avatar';
import { getFullImageByRole } from '../little-vigilante.constants';

export const LittleVigilanteGameBox = () => {
  const imageSrc = getFullImageByRole('vigilante');
  return (
    <RotatableCard css={{ width: '500px', height: '500px' }}>
      <CenterContent href="#" variant="interactive">
        <Image src={imageSrc} />
        <Box css={{ p: '$3' }}>
          <Text size="3" css={{ lineHeight: '23px' }}>
            This is a card. Use it anywhere you can use where typically would
            want a div/view but want some simple styling that fits with the
            theme. Cards are interactive and have hover / press visualizations.
          </Text>
          <Flex css={{ ai: 'center', jc: 'space-between', mt: '$3' }}>
            <Flex css={{ ai: 'center' }}>
              <Text size="2">Inspector T</Text>
            </Flex>
            <Box>
              <Text size="2">May 2020</Text>
            </Box>
          </Flex>
        </Box>
      </CenterContent>
      <RightContent css={{ p: '$3' }}>
        <Image src={getFullImageByRole('detective')} />
      </RightContent>
      <BackContent variant="ghost" css={{ background: '$gray10' }}>
        <Image src={getFullImageByRole('anarchist')} />
      </BackContent>
      <LeftContent>
        <Box />
      </LeftContent>
    </RotatableCard>
  );
};
