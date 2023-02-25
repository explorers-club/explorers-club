import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { colorBySlotNumber, styled } from '@explorers-club/styles';
import { Avatar } from '@atoms/Avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, useCallback, useRef, useState } from 'react';
import { displayNameByRole, Role } from '../../meta/little-vigilante.constants';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import {
  selectIsVoteCalled,
  selectIsVoteFailed,
} from '../../state/little-vigilante.selectors';
import { RoleAvatar } from '../molecules/role-avatar.component';
import { Chat } from '../organisms/chat.component';
import {
  PlayerBoard,
  PlayerBoardItemAvatar,
  PlayerBoardItemCard,
  PlayerBoardItemName,
  PlayerBoardItemRoot,
  usePlayerBoard,
} from '../organisms/player-board';

export const DiscussionPhaseScreenComponent = () => {
  const myUserId = useMyUserId();
  const myInitialRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );
  const roles = useLittleVigilanteSelector((state) => state.roles as Role[]);
  const initial = roles.indexOf(myInitialRole);
  const isVoteFailed = useLittleVigilanteSelector(selectIsVoteFailed);
  const isVoteCalled = useLittleVigilanteSelector(selectIsVoteCalled);
  const isVoteOngoing = isVoteFailed || isVoteCalled;

  return (
    <Flex direction="column" gap="1" css={{ minHeight: '100%' }}>
      <Card>
        <Flex direction="column" gap="2">
          {isVoteOngoing ? (
            isVoteCalled ? (
              <VoteCalled />
            ) : (
              <VoteFailed />
            )
          ) : (
            <DiscussionPlayerBoard />
          )}
        </Flex>
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat />
      </Card>
    </Flex>
  );
};

const DiscussionPlayerBoard = () => {
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );

  const boardActor = usePlayerBoard({
    initialContext: {
      active: players.map(({ userId }) => userId),
      selected: [],
      revealedRoles: {},
    },
  });

  return (
    <PlayerBoard actor={boardActor}>
      {players.map(({ userId, name, slotNumber }) => (
        <DiscussionPlayerBoardItem key={userId} userId={userId} />
      ))}
    </PlayerBoard>
  );
};

const DiscussionPlayerBoardItem: FC<{ userId: string }> = ({ userId }) => {
  const send = useLittleVigilanteSend();

  const { slotNumber, name } = useLittleVigilanteSelector(
    (state) => state.players[userId]
  );

  const handleCallVote = useCallback(() => {
    send({
      type: 'CALL_VOTE',
      targetedUserId: userId,
    });
  }, [send, userId]);

  const roles = useLittleVigilanteSelector((state) => state.roles);
  const handlePressMark = useCallback(
    (role: Role) => {
      return () => {
        send({
          type: 'TARGET_ROLE',
          targetedUserId: userId,
          role,
        });
      };
    },
    [send, userId]
  );
  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  const roleTargets = useLittleVigilanteSelector((state) => {
    const roleTargets = selectRoleTargetsByUserId(state);
    return roleTargets[player.userId] || [];
  });

  const color = colorBySlotNumber[slotNumber];
  return (
    <PlayerBoardItemRoot value={userId}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <PlayerBoardItemCard
            css={{
              position: 'relative',
            }}
          >
            <Box
              css={{
                p: '$1',
                background: `$${color}4`,
                borderRadius: '$2',
              }}
            >
              <PlayerBoardItemName />
              <Flex>
                {/* // Height placeholder */}
                <Box css={{ visibility: 'hidden', width: '1px' }}>
                  <Avatar size="2" />
                </Box>
                {roleTargets
                  .slice(0, 3)
                  .map(({ targetingUserId, role }, index) => (
                    <PlayerRoleTarget
                      key={index}
                      targetingUserId={targetingUserId}
                      role={role}
                    />
                  ))}
              </Flex>
              <Box css={{ position: 'absolute', right: 0, bottom: '-10%' }}>
                <PlayerBoardItemAvatar size={5} />
              </Box>
            </Box>
          </PlayerBoardItemCard>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <PlayerMenuContent className="dark-theme">
            <Card css={{ p: '$1' }}>
              <Flex direction="column" gap="1">
                <Heading variant={colorBySlotNumber[slotNumber]}>
                  {name}
                </Heading>
                <PlayerMenuItem onSelect={handleCallVote}>
                  <Text>
                    <strong>Call Vote</strong> to Identify
                  </Text>
                </PlayerMenuItem>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>
                  <Caption>Mark as...</Caption>
                </DropdownMenu.Label>
                <Grid
                  css={{
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gridAutoRows: 'minmax(0, 1fr)',
                    gap: '$1',
                  }}
                >
                  {roles.map((role) => (
                    <PlayerMenuItem
                      key={role}
                      onSelect={handlePressMark(role as Role)}
                    >
                      <Text size="1">
                        <strong>{displayNameByRole[role as Role]}</strong>
                      </Text>
                    </PlayerMenuItem>
                  ))}
                </Grid>
              </Flex>
            </Card>
          </PlayerMenuContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </PlayerBoardItemRoot>
  );
};

const PlayerMenuContent = styled(DropdownMenu.Content, {
  minWidth: '100px',
  zIndex: 10,
  p: '$2',
});

const PlayerMenuItem = styled(DropdownMenu.Item, {
  backgroundColor: '$primary4',
  px: '$4',
  py: '$2',
  borderRadius: '$2',
  textAlign: 'center',
  cursor: 'pointer',
});

const VoteCalled = () => {
  const myUserId = useMyUserId();
  const isVoteSubmitted = useLittleVigilanteSelector(
    ({ calledVoteResponses }) => myUserId in calledVoteResponses
  );

  const [callingPlayer, targetedPlayer] = useLittleVigilanteSelector(
    (state) => [
      state.players[state.calledVoteUserId],
      state.players[state.calledVoteTargetedUserId],
    ]
  );

  const send = useLittleVigilanteSend();
  const [voted, setVoted] = useState(false);

  const onPressNo = useCallback(() => {
    send({ type: 'REJECT_VOTE' });
    setVoted(true);
  }, [send, setVoted]);

  const onPressYes = useCallback(() => {
    send({ type: 'APPROVE_VOTE' });
    setVoted(true);
  }, [send, setVoted]);

  if (isVoteSubmitted) {
    return <VoteSubmitted />;
  }

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Heading>
        Identify{' '}
        <Text
          variant={colorBySlotNumber[targetedPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {targetedPlayer.name}
        </Text>
        ?
      </Heading>
      <Text>
        <Text
          variant={colorBySlotNumber[callingPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {callingPlayer.name}
        </Text>{' '}
        called a vote to identify{' '}
        <Text
          variant={colorBySlotNumber[targetedPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {targetedPlayer.name}
        </Text>{' '}
        as a vigilante. Continue?
      </Text>
      <Flex css={{ width: '100%', justifyContent: 'stretch' }} gap="2">
        <Button
          color="primary"
          size="3"
          css={{ flexGrow: '1' }}
          onClick={onPressNo}
          disabled={voted}
        >
          No
        </Button>
        <Button
          color="primary"
          size="3"
          css={{ flexGrow: '1' }}
          onClick={onPressYes}
          disabled={voted}
        >
          Yes
        </Button>
      </Flex>
      <Caption css={{ lineHeight: '125%' }}>
        Voting to identify {targetedPlayer.name} will end the round.
        <br />A majority must say yes to proceed.
      </Caption>
    </Flex>
  );
};

const VoteSubmitted = () => {
  const numVotes = useLittleVigilanteSelector(
    (state) => Object.values(state.calledVoteResponses).length
  );
  const numPlayers = useLittleVigilanteSelector(
    (state) => Object.values(state.players).length
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Waiting for results</Caption>
      <Heading>Vote Submitted</Heading>
      <Text>
        <strong>{numVotes}</strong> / {numPlayers} players have voted
      </Text>
    </Flex>
  );
};

const VoteFailed = () => {
  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Heading>Vote Rejected</Heading>
      <Text>The round will continue.</Text>
    </Flex>
  );
};

const selectRoleTargetsByUserId = (state: LittleVigilanteStateSerialized) => {
  const players = Object.values(state.players);
  const roleTargetsByUserId: Record<
    string,
    { targetingUserId: string; role: Role }[]
  > = {};
  Object.values(players).forEach((player) => {
    Object.entries(player.currentRoundRoleTargets).forEach(([userId, role]) => {
      roleTargetsByUserId[userId] ||= [];
      roleTargetsByUserId[userId].push({
        targetingUserId: player.userId,
        role: role as Role,
      });
    });
  });
  return roleTargetsByUserId;
};

const PlayerRoleTarget = ({
  targetingUserId,
  role,
}: {
  targetingUserId: string;
  role: Role;
}) => {
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[targetingUserId].slotNumber
  );
  return (
    <Box
      css={{
        width: 'fit-content',
        height: 'fit-content',
        position: 'relative',
      }}
    >
      <RoleAvatar size="2" roleType={role} />
      <Box
        css={{
          width: '$2',
          height: '$2',
          bottom: 0,
          right: 0,
          position: 'absolute',
          borderRadius: '$2',
          zIndex: 5,
          background: `$${colorBySlotNumber[slotNumber]}9`,
        }}
      />
    </Box>
  );
};
