import { withLittleVigilanteContext } from '../../test/withLittleVigilanteContext';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { CalledVote } from './called-vote.component';

export default {
  component: CalledVote,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    cardCSS: {
      p: '$3',
    },
  },
};

const myUserId = 'alice123';

const players = {
  alice123: {
    name: 'Alice',
  },
  bob123: {
    name: 'Bob',
  },
  charlie123: {
    name: 'Charlie',
  },
  dave123: {
    name: 'Dave',
  },
};

export const Default = () => {
  return <CalledVote />;
};

Default.args = {
  myUserId,
  state: {
    currentStates: ['Playing.Round.DiscussionPhase.Idle'],
  },
};

export const VoteCalled = () => {
  return <CalledVote />;
};

VoteCalled.args = {
  myUserId,
  state: {
    currentStates: ['Playing.Round.DiscussionPhase.VoteCalled'],
    players,
    calledVoteResponses: {
      bob123: true,
    },
  },
};

export const VoteSubmitted = () => {
  return <CalledVote />;
};

VoteSubmitted.args = {
  myUserId,
  players,
  state: {
    currentStates: ['Playing.Round.DiscussionPhase.VoteCalled'],
    players,
    calledVoteResponses: {
      alice123: true,
    },
  },
};

export const VoteFailed = () => {
  return <CalledVote />;
};

VoteFailed.args = {
  myUserId,
  players,
  state: {
    currentStates: ['Playing.Round.DiscussionPhase.VoteFailed'],
    players,
    calledVoteResponses: {
      alice123: true,
    },
  },
};
