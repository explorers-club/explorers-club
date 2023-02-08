import { thumbs } from '@dicebear/collection';
import { FC } from 'react';
import { Flex } from '../atoms/Flex';
import { DicebearAvatar } from './DicebearAvatar';

const colorNameToBackgroundColor = {
  yellow: 'F5D90A',
  white: 'FFFFFF',
  red: 'E5484D',
  green: '30A46C',
  blue: '0091FF',
  purple: '8E4EC6',
  pink: 'D6409F',
  orange: 'F76808',
  brown: 'AD7F58',
  black: '000000',
} as const;

export default {
  component: DicebearAvatar,
};

interface Props {
  seed: string;
}

export const Default = () => {
  return (
    <Flex direction="column" gap="1">
      <Row seed="alice123" />
      <Row seed="bob123" />
      <Row seed="charlie123" />
      <Row seed="dave123" />
      <Row seed="eva123" />
    </Flex>
  );
};

const Row: FC<Props> = ({ seed }) => {
  return (
    <Flex
      css={{
        gap: '$1',
      }}
    >
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.orange],
          backgroundType: ['gradientLinear'],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.yellow],
          backgroundType: ['gradientLinear'],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.purple],
          backgroundType: ['gradientLinear'],
          scale: 50,
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.blue],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.green],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.red],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.brown],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.pink],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.white],
        }}
      />
      <DicebearAvatar
        size="6"
        thumbStyle={thumbs}
        options={{
          seed,
          backgroundColor: [colorNameToBackgroundColor.black],
        }}
      />
    </Flex>
  );
};
