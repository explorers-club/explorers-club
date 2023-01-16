import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Grid } from '@atoms/Grid';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import { Caption } from '@atoms/Caption';
import { Badge } from '@atoms/Badge';
import { Flex } from '@atoms/Flex';
import { Button } from '@atoms/Button';

interface Props {
  players: { name: string; userId: string; team: string; clueGiver: boolean }[];
  myUserId: string;
  isHost: boolean;
  onPressJoinTeam: (team: string) => void;
  onPressBecomeClueGiver: () => void;
  onPressStartGame: () => void;
}

export const ChooseTeamsScreenComponent: FC<Props> = ({
  players,
  myUserId,
  isHost,
  onPressJoinTeam,
  onPressBecomeClueGiver,
  onPressStartGame,
}) => {
  const teamA = players.filter((player) => player.team === 'A');
  const teamB = players.filter((player) => player.team === 'B');
  const myPlayer = players.find((player) => player.userId === myUserId);
  const myTeam = myPlayer?.team;
  const amClueGiver = myPlayer?.clueGiver;

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Caption>Choose teams</Caption>
        <Grid gap="1" css={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Heading css={{ gridColumn: 1, gridRow: 1 }}>Team A</Heading>
          {teamA.map((player, index) => (
            <Card
              key={player.userId}
              css={{ gridColumn: 1, gridRow: index + 2 }}
            >
              <Flex gap="2">
                <Text>{player.name}</Text>
                {player.clueGiver && <Badge>Clue Giver</Badge>}
              </Flex>
            </Card>
          ))}
          <Heading css={{ gridColumn: 2, gridRow: 1 }}>Team B</Heading>
          {teamB.map((player, index) => (
            <Card
              key={player.userId}
              css={{ gridColumn: 2, gridRow: index + 2 }}
            >
              <Flex gap="2">
                <Text>{player.name}</Text>
                {player.clueGiver && <Badge>Clue Giver</Badge>}
              </Flex>
            </Card>
          ))}
          <Button
            onClick={() => onPressJoinTeam(myTeam === 'A' ? 'B' : 'A')}
            css={{
              gridRow: players.length + 1,
              gridColumn: myTeam === 'A' ? 2 : 1,
            }}
          >
            Join Team
          </Button>
          {!amClueGiver && (
            <Button
              onClick={onPressBecomeClueGiver}
              css={{
                gridRow: players.length + 1,
                gridColumn: myTeam === 'A' ? 1 : 2,
              }}
            >
              Become Clue Giver
            </Button>
          )}
        </Grid>
        {isHost && (
          <Button
            size="3"
            css={{ mt: '$3', width: '100%' }}
            onClick={onPressStartGame}
          >
            Start Game
          </Button>
        )}
      </Card>
    </Box>
  );
};
