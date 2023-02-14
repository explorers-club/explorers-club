import { Avatar } from '@atoms/Avatar';
import { Box } from '@atoms/Box';
import { ComponentProps, ElementRef, forwardRef } from 'react';
import {
  getAvatarImageByRole,
  getTeamThemeColor,
  Role,
  teamByRole,
} from '../../meta/little-vigilante.constants';

interface Props {
  roleType: Role;
}

export const RoleAvatar = forwardRef<
  ElementRef<typeof Avatar>,
  Props & ComponentProps<typeof Avatar>
>(({ roleType, ...props }, ref) => {
  const team = teamByRole[roleType];
  const themeColor = getTeamThemeColor(team);

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
        border: `2px solid $colors$${themeColor}9`,
        filter: `drop-shadow(0px 3px 2px $colors$${themeColor}8)`,
      }}
    >
      <Avatar {...props} ref={ref} src={src} />
    </Box>
  );
});
