import { ComponentStory, Meta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import React, { FC } from 'react';
import { TabBarComponent } from './tab-bar.component';
import { createTabBarMachine } from './tab-bar.machine';

export default { component: TabBarComponent } as Meta;

const GameTab = () => {
  return <div>Game Tab</div>;
};

const ClubTab = () => {
  return <div>Club Tab</div>;
};

const ProfileTab = () => {
  return <div>Prof Tab</div>;
};

const LobbyTab: FC = () => {
  return <div>Lobby Tab</div>;
};

export const Primary: ComponentStory<typeof TabBarComponent> = (args) => {
  const tabBarMachine = createTabBarMachine(
    {
      Game: <GameTab />,
      Club: <ClubTab />,
      Profile: <ProfileTab />,
      Lobby: <LobbyTab />,
    },
    ['Game', 'Lobby']
  );
  const actor = useInterpret(tabBarMachine);

  return <TabBarComponent actor={actor} />;
};
