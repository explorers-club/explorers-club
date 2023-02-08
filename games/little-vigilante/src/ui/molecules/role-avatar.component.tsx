import { Avatar } from '@atoms/Avatar';
import { Box } from '@atoms/Box';
import { botttsNeutral, identicon, loreleiNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { ComponentProps, ElementRef, forwardRef, useMemo } from 'react';
import {
  colorByTeam,
  getAvatarImageByRole,
  imageByRole,
  Role,
  teamByRole,
} from '../../meta/little-vigilante.constants';

const colorByTeamColor = {
  cyan: '05A2C2',
  magenta: 'E93D82',
  gold: 'FFB224',
} as const;

interface Props {
  roleType: Role;
}

export const RoleAvatar = forwardRef<
  ElementRef<typeof Avatar>,
  Props & ComponentProps<typeof Avatar>
>(({ roleType, ...props }, ref) => {
  const team = teamByRole[roleType];
  const teamColor = colorByTeam[team];
  console.log({ roleType, team, teamColor });
  // const avatar = useMemo(() => {
  //   return createAvatar(loreleiNeutral, {
  //     seed: roleType,
  //     backgroundColor: [colorByTeamColor[teamColor]],
  //   }).toDataUriSync();
  // }, [roleType, teamColor]);
  const src = getAvatarImageByRole(roleType);
  return (
    <Box
      css={{
        position: 'relative',
        height: 'fit-content',
        width: 'fit-content',
        borderRadius: '50%',
        filter: 'drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5))',
      }}
    >
      <Avatar {...props} ref={ref} src={src} />
    </Box>
  );
});
