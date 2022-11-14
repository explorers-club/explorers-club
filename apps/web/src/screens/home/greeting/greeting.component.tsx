import { Avatar } from '@atoms/Avatar';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Section } from '@atoms/Section';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectPlayerName } from '../../../state/auth.selectors';
import { GlobalStateContext } from '../../../state/global.provider';

export const Greeting = () => {
  const { authActor } = useContext(GlobalStateContext);
  const playerName = useSelector(authActor, selectPlayerName);

  return (
    <Section>
      <Flex
        css={{
          width: '100%',
          px: '$3',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Heading size="3">Welcome {playerName ? playerName : 'back'}</Heading>
        <Avatar size="4" />
      </Flex>
    </Section>
  );
};
