import { thumbs } from '@dicebear/collection';
import { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { PlayerAvatar } from './player-avatar.component';

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
  component: PlayerAvatar,
};

interface Props {
  userId: string;
}

export const Default = () => {
  return (
    <Flex direction="column" gap="1">
      <Row userId="alice123" />
      <Row userId="bob123" />
      <Row userId="charlie123" />
      <Row userId="dave123" />
      <Row userId="eva123" />
    </Flex>
  );
};

const Row: FC<Props> = ({ userId }) => {
  return (
    <Flex
      css={{
        gap: '$1',
      }}
    >
      <PlayerAvatar
        size="6"
	userId={userId}
	color='yellow'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='purple'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='blue'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='green'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='red'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='pink'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='brown'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='black'
      />
      <PlayerAvatar
        size="6"
	userId={userId}
	color='white'
      />
    </Flex>
  );
};
