import { Badge } from '@atoms/Badge';
import { declareComponentKeys } from 'i18nifty';
import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import { FC, useMemo } from 'react';
import {
  abilityByRole,
  colorByTeam,
  displayNameByRole,
  getFullImageByRole,
  getTeamThemeColor,
  objectiveByRole,
  Role,
  Team,
  teamByRole,
} from '../../../meta/little-vigilante.constants';
import { RoleCarousel } from '../role-carousel.component';

interface Props {
  myRole: Role;
  roles: Role[];
}

export const RoleAssignmentComponent: FC<Props> = (props) => {
  const { myRole, roles } = props;
  const myTeam = teamByRole[myRole];
  const color = colorByTeam[myTeam];
  const themeColor = getTeamThemeColor(myTeam);
  const imageSrc = getFullImageByRole(myRole);

  const teamsAndRoles = useMemo(() => {
    return roles.reduce((result, role, index) => {
      const team = teamByRole[role];
      result[team] ||= [];
      result[team].push(role);
      return result;
    }, {} as Record<Team, Role[]>);
  }, [roles]);
  const myTeamRoles = teamsAndRoles[myTeam];
  delete teamsAndRoles[myTeam];

  return (
    <Flex direction="column" css={{ width: '100%' }}>
      <Flex
        direction="column"
        css={{
          background: `linear-gradient($${themeColor}5, $${themeColor}7)`,
          pb: '$2',
        }}
      >
        <Flex
          css={{
            position: 'relative',
            m: '$3',
          }}
        >
          <Flex
            css={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: '$3',
              pt: '$8',
              background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
              borderRadius: '$2',
            }}
            direction="column"
            gap="2"
          >
            <Heading size="3" color="white">
              {displayNameByRole[myRole]}
            </Heading>
            <Text>{objectiveByRole[myRole]}</Text>
            <Text>{abilityByRole[myRole]}</Text>
          </Flex>
          <Image
            css={{
              // aspectRatio: '1',
              // width: 'fit-content',
              borderRadius: '$2',
              boxShadow:
                '0px 4px 8px rgba(0,0,0,.2), 0px 8px 16px rgba(0,0,0,.1)',
            }}
            src={imageSrc}
            alt={myRole}
          />
        </Flex>

        {myTeamRoles.length > 0 && (
          <Flex css={{ width: '100%' }} direction="column" gap="1">
            <Box css={{ px: '$2' }}>
              <Badge css={{ textTransform: 'capitalize' }} variant={color}>
                Team {myTeam}
              </Badge>
            </Box>
            <RoleCarousel roles={myTeamRoles} />
          </Flex>
        )}
        {/* <RoleCard role={myRole} /> */}

        {/* <RoleAvatar size="6" roleType={myRole} /> */}
        {/* <Heading css={{ mt: '$2' }} size="3">
          {displayNameByRole[myRole]}
        </Heading> */}
      </Flex>
      <Flex direction="column" align="center">
        {Object.entries(teamsAndRoles)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([team, roles]) => {
            return <TeamRoles team={team as Team} roles={roles} />;
          })}
      </Flex>
    </Flex>
  );
};

interface TeamRolesProps {
  team: Team;
  roles: Role[];
}

const TeamRoles: FC<TeamRolesProps> = ({ team, roles }) => {
  const color = colorByTeam[team];
  const themeColor = getTeamThemeColor(team);
  return (
    <Flex
      direction="column"
      gap="1"
      css={{ py: '$2', width: '100%', background: `$${themeColor}4` }}
    >
      <Box css={{ px: '$2' }}>
        <Badge css={{ textTransform: 'capitalize' }} variant={color}>
          Team {team}
        </Badge>
      </Box>
      <Box css={{ flexGrow: 1 }}>
        <Box css={{ width: '100%' }}>
          <RoleCarousel roles={roles} />
        </Box>
      </Box>
      {/* <Flex wrap={'wrap'} justify={'end'} gap="1">
        {roles.map((role) => {
          return <RoleAvatar roleType={role} />;
        })}
      </Flex> */}
    </Flex>
  );
};

export const { i18n } = declareComponentKeys<{
  K: 'role_objective';
  P: { role: Role };
}>()({
  RoleAssignmentComponent,
});

// const MyTeam: FC<Props> = ({ myRole, team }) => {
//   return (
//     <Flex align="center" direction="column" gap="1">
//       <Text css={{ mb: '$2' }}>You are the</Text>
//       <RoleAvatar size="6" roleType={myRole} />
//       <Heading css={{ mt: '$2' }} size="3">
//         {displayNameByRole[myRole]}
//       </Heading>
//       <Badge variant={color}>{team}</Badge>
//     </Flex>
//   );
// };
