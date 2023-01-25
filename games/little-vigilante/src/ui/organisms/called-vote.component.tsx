import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { useCallback, useState } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';

export const CalledVote = () => {
  const send = useLittleVigilanteSend();
  const handleCallVote = useCallback(() => {
    send({ type: 'CALL_VOTE' });
  }, [send]);
  const myUserId = useMyUserId();
  const isVoteFailed = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.DiscussionPhase.VoteFailed')
  );
  const isVoteCalled = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.DiscussionPhase.VoteCalled')
  );
  const isVoteSubmitted = useLittleVigilanteSelector(
    ({ currentStates, calledVoteResponses }) =>
      currentStates.includes('Playing.Round.DiscussionPhase.VoteCalled') &&
      myUserId in calledVoteResponses
  );

  return (
    <Box css={{ textAlign: 'center' }}>
      {isVoteCalled ? (
        !isVoteSubmitted ? (
          <VoteCalled />
        ) : (
          <VoteSubmitted />
        )
      ) : isVoteFailed ? (
        <VoteFailed />
      ) : (
        <Button onClick={handleCallVote}>Call Vote</Button>
      )}
    </Box>
  );
};

const VoteFailed = () => {
  return (
    <Flex direction="column" gap="2">
      <Heading>Vote Rejected</Heading>
      <Text>The round will continue.</Text>
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
    <Flex direction="column" gap="2">
      <Caption>Waiting for results</Caption>
      <Heading>Vote Submitted</Heading>
      <Text>
        <strong>{numVotes}</strong> / {numPlayers} players have voted
      </Text>
    </Flex>
  );
};

const VoteCalled = () => {
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

  return (
    <Flex direction="column" gap="2">
      <Heading>Head to Vote?</Heading>
      <Text>A vote's been called. You only have one opportunity to vote.</Text>
      <Text>
        Do it <strong>now</strong>?
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
      <Caption>The vote always happens when time is up</Caption>
    </Flex>
  );
};
