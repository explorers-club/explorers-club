import { Badge } from '@atoms/Badge';
import { A } from '@mobily/ts-belt';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { Text } from '@atoms/Text';
import { CONTINUE } from '@explorers-club/room';
import { Slider, SliderCell } from '@molecules/Slider';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  CheckIcon,
  Cross2Icon,
  DotsHorizontalIcon,
  ThickArrowRightIcon,
} from '@radix-ui/react-icons';
import { useKeenSlider } from 'keen-slider/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  colorByTeam,
  displayNameByRole,
  getTeamThemeColor,
  ROLE_LIST,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { RoleAvatar } from '../molecules/role-avatar.component';

export const HostControls = () => {
  const send = useLittleVigilanteSend();
  const [open, setOpen] = useState(false);
  const isHost = useIsHost();
  const handlePressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!isHost) {
    return null;
  }

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <Flex align="center" justify="between" gap="2" css={{ p: '$2' }}>
        <Collapsible.Trigger asChild>
          <IconButton size="3">
            {open ? <Cross2Icon /> : <DotsHorizontalIcon />}
          </IconButton>
        </Collapsible.Trigger>
        <Button
          css={{ flexGrow: 1 }}
          size="3"
          color="primary"
          onClick={handlePressNext}
        >
          <Flex align="center" gap="1">
            <Text css={{ fontWeight: 'bold' }}>Start</Text>
            <ThickArrowRightIcon />
          </Flex>
        </Button>
      </Flex>

      <Collapsible.Content>
        <Flex direction="column" gap="2">
          <Heading css={{ p: '$2', pb: 0 }}>Roles</Heading>
          <RoleConfigCarousel />
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const RoleConfigCarousel = () => {
  const roles = useLittleVigilanteSelector(
    (state) => state.roles as readonly string[]
  );
  const playerCount = useLittleVigilanteSelector(
    (state) => Object.keys(state.players).length
  );
  const send = useLittleVigilanteSend();
  const [selectedRoles, setSelectedRoles] = useState(roles);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    // hack to extend the range
    range: {
      min: 0,
      max: ROLE_LIST.length,
    },
    slides: {
      perView: 3.5,
    },
  });
  const isRolesValid = useMemo(() => {
    return selectedRoles.length === playerCount + 3;
  }, [selectedRoles, playerCount]);

  useEffect(() => {
    if (isRolesValid) {
      send({ type: 'SET_ROLES', roles: Array.from(selectedRoles) });
    }
  }, [isRolesValid, selectedRoles, send]);

  return (
    <>
      <Slider sliderRef={sliderRef}>
        {ROLE_LIST.map((role) => {
          const team = teamByRole[role];
          const color = colorByTeam[team];
          const themeColor = getTeamThemeColor(team);
          const defaultChecked = roles.includes(role);

          const handleOnCheckChange = (checked: Checkbox.CheckedState) => {
            if (checked) {
              setSelectedRoles(A.uniq([...selectedRoles, role]));
            } else {
              setSelectedRoles(selectedRoles.filter((_role) => role !== _role));
            }
          };

          return (
            <SliderCell
              key={role}
              css={{
                py: '$1',
                borderRadius: '$2',
                ml: '$2',
                overflow: 'visible !important',
                background: `$${themeColor}8`,
              }}
            >
              <Checkbox.Root
                onCheckedChange={handleOnCheckChange}
                defaultChecked={defaultChecked}
                asChild
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
                  <IconButton css={{ background: 'rgba(0,0,0,.2)' }} size="3">
                    <Checkbox.Indicator>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </IconButton>
                </Flex>
              </Checkbox.Root>
            </SliderCell>
          );
        })}
      </Slider>
      {!isRolesValid && (
        <Caption variant={'warning'} css={{ p: '$2', pt: 0 }}>
          For {playerCount} players, enable {playerCount + 3} roles.
          <br />
          Current: {selectedRoles.length}.
        </Caption>
      )}
    </>
  );
};
