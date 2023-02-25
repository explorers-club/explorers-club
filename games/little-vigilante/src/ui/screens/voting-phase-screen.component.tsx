import { Card } from '@atoms/Card';
import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { CONTINUE, LittleVigilanteStateSerialized } from '@explorers-club/room';
import { colorBySlotNumber } from '@explorers-club/styles';
import { FC, useCallback, useContext, useEffect } from 'react';
import { Role } from '../../schema';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { Chat } from '../organisms/chat.component';
import {
  PlayerBoard,
  PlayerBoardActorContext,
  PlayerBoardItemAvatar,
  PlayerBoardItemCard,
  PlayerBoardItemName,
  PlayerBoardItemRoot,
  usePlayerBoard,
} from '../organisms/player-board';
import { send } from 'xstate';
import { Button } from '@atoms/Button';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { Avatar } from '@atoms/Avatar';

export const VotingPhaseScreen = () => {
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );
  const boardActor = usePlayerBoard({
    // initialize() {
    //   // RXJS here, on ability gorup change, call the right method
    //   console.log('hi');
    //   playerBoardRef.send()
    // },
    initialContext: {
      active: [],
      selected: [],
      revealedRoles: {},
    },
  });

  useEffect(() => {
    boardActor.send({
      type: 'ACTIVATE',
      keys: players.map(({ userId }) => userId),
    });
  }, [boardActor, players]);

  return (
    <Flex direction="column" gap="1" css={{ minHeight: '100%' }}>
      <Card>
        <Flex direction="column" gap="2">
          <PlayerBoard actor={boardActor}>
            {players.map(({ userId, name, slotNumber }) => (
              <VotingPlayerBoardItem key={userId} userId={userId} />
            ))}
          </PlayerBoard>
          <HostControls />
        </Flex>
        {/* <VoteGrid /> */}
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat />
      </Card>
    </Flex>
  );
};

const HostControls = () => {
  const isHost = useIsHost();
  const isRevealed = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.Reveal')
  );
  const send = useLittleVigilanteSend();

  const onPressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!isHost || !isRevealed) {
    return null;
  }

  return (
    <Button size="3" color="primary" fullWidth onClick={onPressNext}>
      Continue
    </Button>
  );
};

const selectVotesForPlayerId = (state: LittleVigilanteStateSerialized) => {
  return Object.entries(state.currentRoundVotes).reduce(
    (acc, [userId, votedUserId]) => {
      acc[votedUserId] ||= [];
      acc[votedUserId].push(userId);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

const selectCountsByPlayerId = (state: LittleVigilanteStateSerialized) => {
  return Object.entries(state.currentRoundVotes).reduce(
    (acc, [userId, votedUserId]) => {
      if (acc[votedUserId]) {
        acc[votedUserId]++;
      } else {
        acc[votedUserId] = 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );
};

const VotingPlayerBoardItem: FC<{ userId: string }> = ({ userId }) => {
  const boardActor = useContext(PlayerBoardActorContext);
  const send = useLittleVigilanteSend();
  const { store } = useContext(LittleVigilanteContext);
  const isRevealed = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.Reveal')
  );
  const { slotNumber } = useLittleVigilanteSelector(
    (state) => state.players[userId]
  );
  const isWinner = useLittleVigilanteSelector(
    (state) => state.currentRoundPoints && state.currentRoundPoints[userId] > 0
  );

  useEffect(() => {
    if (isRevealed) {
      boardActor.send({ type: 'CLEAR' });
      boardActor.send({ type: 'DISABLE' });

      Object.entries(store.getSnapshot().currentRoundRoles).forEach(
        ([userId, role]) => {
          boardActor.send({ type: 'REVEAL', key: userId, role: role as Role });
        }
      );
    }
  }, [boardActor, isRevealed, store]);

  const handlePressCard = useCallback(() => {
    boardActor.send({ type: 'CLEAR_SELECTED', key: userId });
    boardActor.send({ type: 'PRESS', key: userId });
    send({ type: 'VOTE', votedUserId: userId });
  }, [boardActor, userId, send]);

  const players = useLittleVigilanteSelector((state) => state.players);
  const votesForPlayerId = useLittleVigilanteSelector(selectVotesForPlayerId);
  const votesForPlayer = votesForPlayerId[userId];
  // const voteCounts = useLittleVigilanteSelector(selectCountsByPlayerId);
  // const votes = voteCounts[userId] || 0;
  useLittleVigilanteSelector((state) => state.currentRoundRoles);

  const color = colorBySlotNumber[slotNumber];
  return (
    <PlayerBoardItemRoot value={userId}>
      <PlayerBoardItemCard
        onClick={handlePressCard}
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
          {isRevealed && (
            <Box css={{ position: 'absolute', right: 0, bottom: '-10%' }}>
              <PlayerBoardItemAvatar size={5} />
            </Box>
          )}
          {isRevealed ? (
            <Text size="4" css={{ fontWeight: 'bold' }}>
              {isWinner ? 'Winner' : <>&nbsp;</>}
            </Text>
          ) : (
            <Flex>
              {/* // Height placeholder */}
              <Box css={{ visibility: 'hidden', width: '1px' }}>
                <Avatar size="2" />
              </Box>
              {votesForPlayer &&
                votesForPlayer.map((votedByUser) => (
                  <PlayerAvatar
                    size="2"
                    userId={votedByUser}
                    color={colorBySlotNumber[players[votedByUser].slotNumber]}
                  >
                    {votedByUser}
                  </PlayerAvatar>
                ))}
            </Flex>
          )}
        </Box>
      </PlayerBoardItemCard>
    </PlayerBoardItemRoot>
  );
};
