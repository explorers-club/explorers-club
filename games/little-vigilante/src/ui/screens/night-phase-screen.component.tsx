import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { usePrevious } from '@explorers-club/utils';
import { ProgressBar } from '@molecules/ProgressBar';
import { CaretUpIcon, MoveIcon } from '@radix-ui/react-icons';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { abilityGroups } from '../../meta/little-vigilante.constants';
import { Role } from '../../schema';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import {
  useLittleVigilanteSend,
  useMyUserId,
  useLittleVigilanteSelector,
} from '../../state/little-vigilante.hooks';
import {
  selectAbilityGroup,
  selectIdlePlayers,
} from '../../state/little-vigilante.selectors';
import { AbilityGroupCarousel } from '../organisms/ability-group-carousel.component';
import { Chat } from '../organisms/chat.component';
import { NightActions } from '../organisms/night-actions';

export const NightPhaseScreenComponent = () => {
  return (
    <Flex
      direction="column"
      gap="1"
      css={{ minHeight: '100%', maxHeight: '100%' }}
    >
      <Card css={{ flex: '0 0 120px' }}>
        <Flex>
          <AbilityGroupCarousel />
        </Flex>
      </Card>
      <Card>
        {/* todo rename to NightPlayerBoard */}
        <NightActions />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
        <TapTarget />
        <Chat disabled />
      </Card>
    </Flex>
  );
};

const TapTarget = () => {
  const roleIsActive = useMyRoleIsActive();

  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();

  const handlePressDown = useCallback(() => {
    send({ type: 'PRESS_DOWN' });
  }, [send]);

  const handlePressUp = useCallback(() => {
    send({ type: 'PRESS_UP' });
  }, [send]);
  const prevRoleIsActive = usePrevious(roleIsActive);

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

  useEffect(() => {
    if (roleIsActive && !prevRoleIsActive) {
      send({ type: 'PRESS_UP' });
    }

    // Automatically press if user finished their ability
    // Only do if they didnt just become idle though
    const idlePlayers = selectIdlePlayers(store.getSnapshot());
    if (!roleIsActive && prevRoleIsActive && !idlePlayers.length) {
      send({ type: 'PRESS_UP' });
    }
  }, [send, roleIsActive, prevRoleIsActive, store]);
  return (
    <Box
      css={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 }}
    >
      <IdleTimer />
      <Button
        size="3"
        onPointerDown={handlePressDown}
        onPointerUp={handlePressUp}
        fullWidth
        disabled={roleIsActive}
        css={{
          background: `$${variant}9`,
          border: `3px solid $${variant}6`,
          '&:hover': {
            background: `$${variant}10`,
          },
          '&:active': {
            background: `$${variant}8`,
            outline: `3px solid $${variant}10`,
          },
        }}
      >
        {!roleIsActive ? (
          <Flex gap="1">
            <Text css={{ fontWeight: 'bold' }}>Tap</Text>
            <MoveIcon />
          </Flex>
        ) : (
          <YourTurnText />
        )}
      </Button>
    </Box>
  );
};

const YourTurnText = () => {
  return (
    <Flex gap="1">
      <Text css={{ fontWeight: 'bold' }}>Your turn</Text>
      <CaretUpIcon />
    </Flex>
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
