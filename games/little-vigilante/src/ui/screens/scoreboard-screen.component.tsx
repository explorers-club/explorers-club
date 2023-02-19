import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Chat } from '../organisms/chat.component';
import { HostControls } from '../organisms/host-controls.component';
import { Scoreboard } from '../organisms/scoreboard.component';

export const ScoreboardScreen = () => {
  return (
    <Flex css={{ p: '$3', height: '100%' }} direction="column" gap="2">
      <Card>
        <HostControls />
      </Card>
      <Card>
        <Scoreboard />
      </Card>
      <Card css={{ flexGrow: 1 }}>
        <Chat />
      </Card>
    </Flex>
  );
};
