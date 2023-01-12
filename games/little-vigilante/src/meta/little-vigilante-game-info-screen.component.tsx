import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import {
  abilityByRole,
  nightPhaseOrder,
  teamByRole,
} from './little-vigilante.constants';

export const LittleVigilanteGameInfoScreen = () => {
  return (
    <Flex css={{ p: '$3' }} gap="2" direction="column">
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
            previous night then vote on who they believe is the Vigilante.
          </Text>
          <Text>
            3. If the the player with the vigilante role receives the most
            votes, the citizen team wins the round. If the vigilante does not
            receive the most votes, the vigilante team wins the round.
          </Text>
          <Text>Each round lasts about five minutes.</Text>
          <Text>
            Before the game starts, players choose how many rounds they would
            like to play for. Players earn a point each time they win a round.
            After completing the last round, the player with the most points
            wins.
          </Text>
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading size="3">Roles</Heading>
        <Flex direction="column" gap="3">
          {Object.entries(abilityByRole).map(([role, ability]) => (
            <Flex direction="column" gap="2" key={role}>
              <Heading size="2">{role}</Heading>
              <Text>Team: {teamByRole[role]}</Text>
              <Text>Ability: {ability}</Text>
            </Flex>
          ))}
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading size="3">Night Order</Heading>
        <Text>During the night phase, players always go in this order:</Text>
        <Flex direction="column" gap="3">
          {nightPhaseOrder.map((role) => (
            <Heading size="2" key={role}>
              {role}
            </Heading>
          ))}
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading>Rules</Heading>
        <Text>
          · If two players split the vote and one of those players is the
          vigilante, the citizens team wins.
        </Text>
        <Text>
          · The anarchist can win by receiving the most votes. If the anarchist
          wins, the vigilante team does not.
        </Text>
      </Card>
    </Flex>
  );
};
