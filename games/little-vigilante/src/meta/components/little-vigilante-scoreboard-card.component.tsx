import { Box } from '@atoms/Box';
import { Badge } from '@atoms/Badge';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Heading } from '@atoms/Heading';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Table, Thead, Tbody, Td, Th, Tr } from '@atoms/Tables';
import { styled } from '@explorers-club/styles';

const TableStyled = styled(Table, {
  [`${Tr}`]: {
    color: 'white',
  },
});

const ThStyled = styled(Th, {
  width: '150px',
});

export const LittleVigilanteScoreboardCard = () => {
  return (
    <Card css={{ p: '$3' }}>
      <Flex direction="column" gap="3">
        <Flex direction="column" gap="2">
          <Caption>This month</Caption>
          <Heading>Scorebboard</Heading>
        </Flex>
        <Flex gap="1">
          <Badge>Today</Badge>
          <Badge>This week</Badge>
          <Badge>Last 30 days</Badge>
          <Badge>Last 90 days</Badge>
        </Flex>
        <TableStyled>
          <Thead>
            <Tr>
              <Td align="center">Rank</Td>
              <ThStyled>Player</ThStyled>
              <Td align="center">GP</Td>
              <Td align="center">Win %</Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td align="center">1</Td>
              <ThStyled>Teddy</ThStyled>
              <Td align="center">32</Td>
              <Td align="center">.590</Td>
            </Tr>
          </Tbody>
          <Tbody>
            <Tr>
              <Td align="center">2</Td>
              <ThStyled>Jam</ThStyled>
              <Td align="center">31</Td>
              <Td align="center">.570</Td>
            </Tr>
          </Tbody>
        </TableStyled>
      </Flex>
    </Card>
  );
};
