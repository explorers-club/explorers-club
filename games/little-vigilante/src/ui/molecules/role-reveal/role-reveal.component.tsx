import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { colorBySlotNumber } from '@explorers-club/styles';
import { Slider, SliderCell } from '@molecules/Slider';
import { useKeenSlider } from 'keen-slider/react';
import { FC } from 'react';
import {
  colorByTeam,
  getTeamThemeColor,
  Role,
  teamByRole,
} from '../../../meta/little-vigilante.constants';
import { PlayerAvatar } from '../player-avatar.component';
import { RoleAvatar } from '../role-avatar.component';

interface Props {
  playerOutcomes: {
    playerName: string;
    role: Role;
    winner: boolean;
    userId: string;
    slotNumber: number;
  }[];
  myWinState: boolean;
  onPressNext?: () => void;
}

export const RoleRevealComponent: FC<Props> = ({
  playerOutcomes,
  myWinState,
  onPressNext,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const winners = playerOutcomes.filter((player) => player.winner);
  const losers = playerOutcomes.filter((player) => !player.winner);
  const winningRole = winners[0].role;
  const winningTeam = teamByRole[winningRole];
  const losingTeams = Array.from(
    new Set(losers.map((p) => teamByRole[p.role]))
  );
  const winningColor = colorByTeam[winningTeam];

  const vigilante = playerOutcomes.find(
    (player) => player.role === 'vigilante'
  )!;
  const sidekick = playerOutcomes.find((player) => player.role === 'sidekick');
  // const team = teamByRole[winningRole];

  const [winnerSliderRef] = useKeenSlider<HTMLDivElement>({
    // drag: false,
    mode: 'free-snap',
    // renderMode: 'performance',
    // drag: false,
    // created(s) {
    //   s.moveToIdx(winners.length, true, animation);
    // },
    // updated(s) {
    //   s.moveToIdx(s.track.details.abs + winners.length, true, animation);
    // },
    // animationEnded(s) {
    //   s.moveToIdx(s.track.details.abs + winners.length, true, animation);
    // },
    slides: {
      perView: 2.5,
    },
  });

  const [losersSliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'free-snap',
    renderMode: 'performance',
    // drag: false,
    slides: {
      perView: 4.5,
    },
  });

  return (
    <Flex direction="column" gap="3">
      <Flex direction="column" gap="2">
        <Box css={{ px: '$3' }}>
          <Flex direction="column" align="start" gap="1">
            <Heading
              size="3"
              css={{ textTransform: 'capitalize', textAlign: 'center' }}
            >
              {myWinState ? 'You Win!' : 'You Lost'}
            </Heading>
            <Text>
              <Text
                variant={colorBySlotNumber[vigilante.slotNumber]}
                css={{ fontWeight: 'bold', display: 'inline' }}
              >
                {vigilante.playerName}
              </Text>{' '}
              {sidekick ? (
                <>
                  and{' '}
                  <Text
                    variant={colorBySlotNumber[sidekick.slotNumber]}
                    css={{ fontWeight: 'bold', display: 'inline' }}
                  >
                    {sidekick.playerName}
                  </Text>{' '}
                  are the{' '}
                  <Text
                    variant="crimson"
                    css={{ fontWeight: 'bold', display: 'inline' }}
                  >
                    Vigilantes
                  </Text>
                  .
                </>
              ) : (
                `is the vigilante.`
              )}
            </Text>
          </Flex>
          {/* <Flex direction="column" gap="1">
            <Badge css={{ textTransform: 'capitalize' }} variant={color}>
              Team {team} Wins
            </Badge>
          </Flex> */}
        </Box>
      </Flex>
      <Flex gap="2" direction="column">
        <Flex>
          <Heading css={{ px: '$3' }}>Winners</Heading>
          <Badge variant={winningColor} css={{ textTransform: 'caplitalize' }}>
            {winningTeam}
          </Badge>
        </Flex>
        <Slider sliderRef={winnerSliderRef}>
          {winners.map(({ playerName, role, userId, slotNumber }, index) => (
            <SliderCell
              css={{
                ml: '$2',
              }}
            >
              <Box
                css={{
                  background: '$primary6',
                  borderRadius: '$2',
                  p: '$2',
                }}
              >
                <Box css={{ position: 'relative', display: 'inline-block' }}>
                  <PlayerAvatar
                    userId={userId}
                    color={colorBySlotNumber[slotNumber]}
                    size="5"
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      bottom: 0,
                      right: '-15px',
                    }}
                  >
                    <RoleAvatar size="2" roleType={role} />
                  </Box>
                </Box>
                <Heading
                  variant={colorBySlotNumber[slotNumber]}
                  css={{ mt: '$2' }}
                >
                  {playerName}
                </Heading>
                <Caption css={{ color: 'white' }} size="2">
                  {role}
                </Caption>
              </Box>
            </SliderCell>
          ))}
        </Slider>
      </Flex>
      <Flex gap="2" direction="column">
        <Flex>
          <Heading css={{ px: '$3' }}>Losers</Heading>
          <Flex gap="1">
            {losingTeams.map((team) => {
              return (
                <Badge
                  variant={colorByTeam[team]}
                  key={team}
                  css={{ textTransform: 'caplitalize' }}
                >
                  {team}
                </Badge>
              );
            })}
          </Flex>
        </Flex>
        <Slider sliderRef={losersSliderRef}>
          {losers.map(({ playerName, role, userId, slotNumber }, index) => (
            <SliderCell
              css={{
                ml: '$2',
                overflow: 'visible !important',
              }}
            >
              <Box
                css={{
                  background: '$primary6',
                  p: '$1',
                  borderRadius: '$2',
                }}
              >
                <Box css={{ position: 'relative', display: 'inline-block' }}>
                  <PlayerAvatar
                    userId={userId}
                    color={colorBySlotNumber[slotNumber]}
                    size="4"
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      bottom: 0,
                      right: '-15px',
                    }}
                  >
                    <RoleAvatar roleType={role} />
                  </Box>
                </Box>
                <Heading
                  variant={colorBySlotNumber[slotNumber]}
                  css={{ mt: '$2' }}
                >
                  {playerName}
                </Heading>
                <Caption css={{ color: 'white' }}>{role}</Caption>
              </Box>
            </SliderCell>
          ))}
        </Slider>
      </Flex>
      {onPressNext && (
        <Button size="3" color="primary" fullWidth onClick={onPressNext}>
          Continue
        </Button>
      )}
    </Flex>
  );
};
