import { Avatar } from '@atoms/Avatar';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { PartyActor, PartyPlayerActor } from '@explorers-club/party';
import { PersonIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { FC } from 'react';

interface Props {
  actor: PartyPlayerActor;
  partyActor: PartyActor;
}

export const PlayerListItem: FC<Props> = ({ actor, partyActor }) => {
  const actorId = actor.id;
  const hostActorId = useSelector(
    partyActor,
    (state) => state.context.hostActorId
  );

  // const iAmHost = false; // todo get my actor id from auth
  // const actorIsNotHost = hostActorId !== actorId;

  const name = useSelector(actor, (state) => state.context.playerName);
  // const isReady = useSelector(actor, (state) => !!state.matches('Ready.Yes'));

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
