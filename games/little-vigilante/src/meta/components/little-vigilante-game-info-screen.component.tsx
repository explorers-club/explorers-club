import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import {
  abilityByRole,
  colorByTeam, imageByRole, Role,
  teamByRole
} from '../little-vigilante.constants';

export const LittleVigilanteGameInfoScreen = () => {
  return (
    <Flex gap="2" direction="column">
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <Caption>Little Vigilante</Caption>
          <Heading size="3">How to Play</Heading>
          <Text>
            Little Vigilante is a social deduction game for 4-10 players. Each
            player takes on the role of a different character with unique
            abilities. The goal of the game is for the citizens to correctly
            identify who is the Little Vigilante.
          </Text>
          <Text>Here are the basic rules of the game:</Text>
          <Text>
            1. Each player is dealt a role card at the start of each round.
          </Text>
          <Text>
            2. The game is divided into two phases: night and morning. During
            the night phase, players perform their night actions as dictated by
            their role. In the morning phase, players discuss the events of the
            previous night then vote on who they believe are the vigilantes.
          </Text>
          <Text>
            3. If the player with the vigilante or sidekick role receives the
            most votes, the citizen team wins the round. If the vigilante or
            their sidekick does not receive the most votes, the vigilante team
            wins the round.
          </Text>
          <Text>Each round lasts about seven minutes.</Text>
          <Text>
            Before the game starts, players choose how many rounds they would
            like to play for. Players earn a point each time they win a round.
            After completing the last round, the player with the most points
            wins.
          </Text>
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading size="3">Teams & Roles</Heading>
        <Flex direction="column" gap="3">
          {Object.entries(abilityByRole).map(([role, ability]) => (
            <Flex direction="column" gap="2" key={role}>
              <Box css={{ position: 'relative' }}>
                <Badge
                  variant={colorByTeam[teamByRole[role as Role]]}
                  css={{ position: 'absolute', top: '$2', right: '$2' }}
                >
                  {teamByRole[role as Role]}
                </Badge>
                <Image src={imageByRole[role as Role]} alt={role} />
                <Box
                  css={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    p: '$4',
                    pt: '$8',
                    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
                  }}
                >
                  <Heading size="2" css={{ mb: '$1' }}>
                    {role}
                  </Heading>
                  <Text>Ability: {ability}</Text>
                </Box>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading>Things To Remember</Heading>
        <Text>
          · If two players split the vote and one of those players is the
          vigilante or the sidekick, the citizens team wins.
        </Text>
        <Text>
          · The anarchist can win by receiving the most votes. If the anarchist
          wins, the vigilante team does not.
        </Text>
      </Card>
    </Flex>
  );
};
