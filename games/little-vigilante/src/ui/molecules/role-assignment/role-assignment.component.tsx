import { Badge } from '@atoms/Badge';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Caption } from '@atoms/Caption';
import { Text } from '@atoms/Text';
import { FC, useMemo } from 'react';
import {
  colorByTeam,
  displayNameByRole,
  getTeamThemeColor,
  Role,
  Team,
  teamByRole,
} from '../../../meta/little-vigilante.constants';
import { RoleAvatar } from '../role-avatar.component';

interface Props {
  myRole: Role;
  roles: Role[];
}

export const RoleAssignmentComponent: FC<Props> = (props) => {
  const { myRole, roles } = props;
  const myTeam = teamByRole[myRole];
  const color = colorByTeam[myTeam];
  const themeColor = getTeamThemeColor(myTeam);

  const teamsAndRoles = useMemo(() => {
    return roles.reduce((result, role, index) => {
      const team = teamByRole[role];
      result[team] ||= [];
      result[team].push(role);
      return result;
    }, {} as Record<Team, Role[]>);
  }, [roles]);

  return (
    <Flex justify={"between"}>
      <Flex
        align="center"
        direction="column"
        justify="center"
        gap="1"
        css={{ p: '$3', textAlign: "center", background: "$primary5", borderRadius: "$4" }}
      >
        <Heading css={{ mb: '$2' }}>You are the</Heading>
        <RoleAvatar size="6" roleType={myRole} />
        <Heading css={{ mt: '$2' }} size="3">
          {displayNameByRole[myRole]}
        </Heading>
      </Flex>
      <Flex direction="column" align="end" gap="4">
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
  return (
    <Flex direction="column" gap="2">
      <Badge css={{ textTransform: 'capitalize' }} variant={color}>
        Team {team}
      </Badge>
      <Flex wrap={"wrap"} justify={"end"} gap="1">
        {roles.map((role) => {
          return <RoleAvatar roleType={role} />;
        })}
      </Flex>
    </Flex>
  );
};

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
