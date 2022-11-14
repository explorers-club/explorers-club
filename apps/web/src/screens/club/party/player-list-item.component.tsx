import { Avatar } from '@atoms/Avatar';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { PartyEvents, PartyPlayerActor } from '@explorers-club/party';
import { PersonIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useContext } from 'react';
import { PartyContext } from './party.context';

interface Props {
  actor: PartyPlayerActor;
}

export const PlayerListItem: FC<Props> = ({ actor }) => {
  const actorId = actor.id;
  const { partyActor } = useContext(PartyContext);
  const hostActorId = useSelector(
    partyActor,
    (state) => state.context.hostActorId
  );

  const iAmHost = false; // todo get my actor id from auth
  const actorIsNotHost = hostActorId !== actorId;
  const showRemoveButton = iAmHost && actorIsNotHost;

  const name = useSelector(actor, (state) => state.context.playerName);
  const isReady = useSelector(actor, (state) => !!state.matches('Ready.Yes'));

  // const handleRemove = useCallback(() => {
  //   partyActor.send(PartyEvents.PLAYER_REMOVE({ actorId }));
  // }, [partyActor, actorId]);
  const displayName = name || 'A new explorer...';

  return (
    <Flex css={{ gap: '$3', alignItems: 'center' }}>
      <Avatar size="3" fallback={name ? name[0] : 'EXP'} />
      <Flex css={{ fd: 'column', gap: '$1' }}>
        <Text size="4" css={{ color: '$gray12' }}>
          {displayName}
        </Text>
        <Text size="1" css={{ color: '$gray11' }}>
          Connecting
        </Text>
      </Flex>
    </Flex>
  );
};

export const PlayerListItemPlaceholder = () => {
  return (
    <Flex css={{ gap: '$3', alignItems: 'center' }}>
      <Avatar size="3" fallback={<PersonIcon color="var(--colors-gray9)" />} />
      <Text size="2" css={{ color: '$gray11' }}>
        Empty
      </Text>
    </Flex>
  );
};
