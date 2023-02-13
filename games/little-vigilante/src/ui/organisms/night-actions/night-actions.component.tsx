import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { ProgressBar } from '@molecules/ProgressBar';
import { usePrevious } from '@explorers-club/utils';
import { MoveIcon } from '@radix-ui/react-icons';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { abilityGroups, Role } from '../../../meta/little-vigilante.constants';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../../state/little-vigilante.hooks';
import { selectAbilityGroup } from '../../../state/little-vigilante.selectors';
import { NightPhaseAnarchist } from '../../molecules/night-phase-anarchist.container';
import { NightPhaseButler } from '../../molecules/night-phase-butler.container';
import { NightPhaseConArtist } from '../../molecules/night-phase-con-artist.container';
import { NightPhaseCop } from '../../molecules/night-phase-cop.container';
import { NightPhaseDetective } from '../../molecules/night-phase-detective.container';
import { NightPhaseMonk } from '../../molecules/night-phase-monk.container';
import { NightPhaseSidekick } from '../../molecules/night-phase-sidekick.container';
import { NightPhaseSnitch } from '../../molecules/night-phase-snitch.container';
import { NightPhaseTwinBoy } from '../../molecules/night-phase-twin-boy.container';
import { NightPhaseTwinGirl } from '../../molecules/night-phase-twin-girl.container';
import { NightPhaseVigilante } from '../../molecules/night-phase-vigilante.container';
import { Timer } from './timer.component';
import { NightPhaseArrested } from '../../molecules/night-phase-arrested.component';

export const NightActions = () => {
  return (
    <Box>
      <ActivityTarget />
      <IdleTimer />
      <NightAbility />
    </Box>
  );
};

const IdleTimer = () => {
  const myUserId = useMyUserId();
  const secondsLeft = useLittleVigilanteSelector((state) => {
    const down = state.currentDownState[myUserId];
    if (down) {
      return 10;
    }

    return Math.max(
      Math.floor(
        (state.lastDownState[myUserId] + 60 * 10 - state.currentTick) / 60
      ),
      0
    );
  });

  const variant = useMemo(() => {
    if (secondsLeft > 6) {
      return 'success';
    } else if (secondsLeft > 3) {
      return 'warning';
    }
    return 'error';
  }, [secondsLeft]);

  return (
    <ProgressBar variant={variant} value={secondsLeft} max={10} />
    // <Box css={{ width: '100%', height: '22px', background: `$${color}9`, position: "relative" }} >
    //   </Box>
  );
};

const ActivityTarget = () => {
  const roleIsActive = useMyRoleIsActive();

  const send = useLittleVigilanteSend();

  const handlePressDown = useCallback(() => {
    send({ type: 'PRESS_DOWN' });
  }, [send]);

  const handlePressUp = useCallback(() => {
    send({ type: 'PRESS_UP' });
  }, [send]);
  const prevRoleIsActive = usePrevious(roleIsActive);

  useEffect(() => {
    if (roleIsActive && !prevRoleIsActive) {
      send({ type: 'PRESS_UP' });
    }

    if (!roleIsActive && prevRoleIsActive) {
      send({ type: 'PRESS_UP' });
    }
  }, [send, roleIsActive, prevRoleIsActive]);

  if (roleIsActive) {
    return null;
  }

  return (
    <Button
      size="3"
      onPointerDown={handlePressDown}
      onPointerUp={handlePressUp}
      fullWidth
      css={{
        borderRadius: '$4',
        height: '75px',
      }}
    >
      <Flex gap="1">
        <Text css={{ fontWeight: 'bold' }}>Tap</Text>
        <MoveIcon />
      </Flex>
    </Button>
  );
};

const useMyRoleIsActive = () => {
  const myUserId = useMyUserId();
  const currentAbilityGroup = useLittleVigilanteSelector(selectAbilityGroup);
  const myRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );

  return useMemo(() => {
    if (!currentAbilityGroup) {
      return false;
    }

    return abilityGroups[currentAbilityGroup].includes(myRole);
  }, [currentAbilityGroup, myRole]);
};

const NightAbility = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );
  const isArrested = useLittleVigilanteSelector((state) => {
    return myUserId === state.currentRoundArrestedPlayerId;
  });

  const roleIsActive = useMyRoleIsActive();
  const abilityGroup = useLittleVigilanteSelector(selectAbilityGroup);
  console.log(abilityGroup, myRole);

  // const roleIsActive = useMemo(() => {
  //   if (!currentAbilityGroup) {
  //     return false;
  //   }

  //   return abilityGroups[currentAbilityGroup].includes(myRole);
  // }, [currentAbilityGroup, myRole]);

  if (!abilityGroup) {
    return null;
  }
  const roles = abilityGroups[abilityGroup];

  const NightPhaseComponent = roles.includes(myRole) ? (
    !isArrested ? (
      nightPhaseComponentsByRole[myRole]
    ) : (
      <NightPhaseArrested />
    )
  ) : null;

  // const expanded = abilityGroups[currentAbilityGroup].includes(myRole);;
  // const abilityGroup = useLittieVigilanteSelector(selectAbilityGroup);
  return (
    <Box
      css={{
        ...(!roleIsActive ? { height: '1px' } : {}),
      }}
    >
      {NightPhaseComponent && (
        <Box css={{ p: '$3' }}>{NightPhaseComponent}</Box>
      )}
    </Box>
  );
};

const nightPhaseComponentsByRole: Partial<Record<Role, ReactNode>> = {
  anarchist: <NightPhaseAnarchist />,
  butler: <NightPhaseButler />,
  snitch: <NightPhaseSnitch />,
  cop: <NightPhaseCop />,
  detective: <NightPhaseDetective />,
  monk: <NightPhaseMonk />,
  con_artist: <NightPhaseConArtist />,
  sidekick: <NightPhaseSidekick />,
  twin_boy: <NightPhaseTwinBoy />,
  twin_girl: <NightPhaseTwinGirl />,
  vigilante: <NightPhaseVigilante />,
};
