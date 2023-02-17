import { Badge } from '@atoms/Badge';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Slider, SliderCell } from '@molecules/Slider';
import { useKeenSlider } from 'keen-slider/react';
import { FC, useContext } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import {
  colorByTeam,
  displayNameByRole,
  getTeamThemeColor,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import { Role } from '../../schema';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import {
  selectAbilityGroup,
  selectAbilityGroups,
} from '../../state/little-vigilante.selectors';
import { RoleAvatar } from './role-avatar.component';

interface Props {
  roles: Role[];
}

export const RoleCarousel: FC<Props> = ({ roles }) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: Math.floor((roles.length - 1) / 2),
    mode: 'free-snap',
    slides: {
      perView: 3.5,
    },
  });
  return (
    <Slider sliderRef={sliderRef}>
      {roles.map((role) => {
        const team = teamByRole[role];
        const color = colorByTeam[team];
        const themeColor = getTeamThemeColor(team);
        return (
          <SliderCell
            key={role}
            css={{
              py: '$1',
              borderRadius: "$2",
              ml: '$2',
              overflow: 'visible !important',
              background: `$${themeColor}8`,
            }}
          >
            <Flex direction="column" align="center" gap="2">
              <RoleAvatar
                css={{
                  border: `2px solid ${themeColor}9`,
                  borderRadius: '50%',
                  filter: `drop-shadow(0px 2px 4px $colors${themeColor}9)`,
                }}
                size="4"
                roleType={role}
              />
              <Badge variant={color}>{displayNameByRole[role]}</Badge>
            </Flex>
          </SliderCell>
        );
      })}
    </Slider>
  );
};
