import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { ChooseTeamsScreenComponent } from './choose-teams-screen.component';

export default {
  component: ChooseTeamsScreenComponent,

  argTypes: {
    onPressJoinTeam: { action: 'joinTeam' },
    onPressStartGame: { action: 'startGame' },
    onPressBecomeClueGiver: { action: 'becomeClueGiver' },
  },
} as Meta;

const Template: ComponentStory<typeof ChooseTeamsScreenComponent> = (args) => {
  return <ChooseTeamsScreenComponent {...args} />;
};

const players = [
  {
    name: 'Alice',
    userId: 'alice123',
    team: 'A',
    clueGiver: true,
  },
  {
    name: 'Bob',
    userId: 'bob123',
    team: 'A',
    clueGiver: false,
  },
  {
    name: 'Charlie',
    userId: 'charlie123',
    team: 'B',
    clueGiver: true,
  },
  {
    name: 'Dave',
    userId: 'dave123',
    team: 'B',
    clueGiver: false,
  },
  {
    name: 'Eve',
    userId: 'eve123',
    team: 'A',
    clueGiver: false,
  },
  {
    name: 'Frank',
    userId: 'frank123',
    team: 'B',
    clueGiver: false,
  },
  {
    name: 'Grace',
    userId: 'grace123',
    team: 'B',
    clueGiver: false,
  },
  {
    name: 'Heidi',
    userId: 'heidi123',
    team: 'A',
    clueGiver: false,
  },
];

export const Host = Template.bind({});

Host.args = {
  myUserId: 'alice123',
  players,
  isHost: true,
};

export const ClueGiver = Template.bind({});

ClueGiver.args = {
  myUserId: 'bob123',
  players,
  isHost: false,
};

export const Player = Template.bind({});

Player.args = {
  myUserId: 'grace123',
  players,
  isHost: false,
};
