import { Box } from '@atoms/Box';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { colorBySlotNumber } from '@explorers-club/styles';
import { usePrevious } from '@explorers-club/utils';
import { ProgressBar } from '@molecules/ProgressBar';
import { MoveIcon } from '@radix-ui/react-icons';
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { filter, from, take } from 'rxjs';
import {
  abilityByRole,
  abilityGroups,
  Role,
} from '../../../meta/little-vigilante.constants';
import { LittleVigilanteContext } from '../../../state/little-vigilante.context';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../../state/little-vigilante.hooks';
import {
  selectAbilityGroup,
  selectIdlePlayers,
  selectPlayers,
  selectSidekickPlayer,
  selectTwinBoyPlayer,
  selectTwinGirlPlayer,
  selectVigilantePlayer,
} from '../../../state/little-vigilante.selectors';
import {
  PlayerBoard,
  PlayerBoardActorContext,
  PlayerBoardItemAvatar,
  PlayerBoardItemCard,
  PlayerBoardItemName,
  PlayerBoardItemRoot,
  usePlayerBoard,
} from '../player-board';

export const NightActions = () => {
  return <NightPlayerBoard />;
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

  return <ProgressBar variant={variant} value={secondsLeft} max={10} />;
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

const NightPlayerBoard = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );
  // const roleIsActive = useMyRoleIsActive();
  // const abilityGroup = useLittleVigilanteSelector(selectAbilityGroup);
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );

  const boardActor = usePlayerBoard({
    // initialize() {
    //   // RXJS here, on ability gorup change, call the right method
    //   console.log('hi');
    //   playerBoardRef.send()
    // },
    initialContext: {
      active: [myUserId],
      selected: [],
      revealedRoles: {
        [myUserId]: myRole,
      },
    },
  });

  return (
    <PlayerBoard actor={boardActor}>
      <PlayerBoardStart />
      <PlayerBoardActivity />
      {players.map(({ userId, name, slotNumber }) => (
        <NightPlayerBoardItem key={userId} userId={userId} />
      ))}
      <PlayerBoardNightStatus />
    </PlayerBoard>
  );
};

const PlayerBoardStart = () => {
  const myUserId = useMyUserId();
  const boardActor = useContext(PlayerBoardActorContext);
  const isStarting = useLittleVigilanteSelector((state) =>
    state.currentStates.includes(
      'Playing.Round.NightPhase.AbilityGroup.Running.Starting'
    )
  );
  const wasStarting = usePrevious(isStarting);
  useEffect(() => {
    if (wasStarting && !isStarting) {
      boardActor.send({
        type: 'UNREVEAL',
        key: myUserId,
        deactivate: true,
      });
    }
  }, [boardActor, myUserId, isStarting, wasStarting]);

  return null;
};

const PlayerBoardActivity = () => {
  const isPaused = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.NightPhase.Timer.Paused')
  );

  if (isPaused) {
    return <PlayerBoardIdle />;
  }

  return null;
};

const PlayerBoardIdle = () => {
  const idlePlayers = useLittleVigilanteSelector(selectIdlePlayers);
  const boardActor = useContext(PlayerBoardActorContext);
  useLittleVigilanteSelector((state) => state);

  useEffect(() => {
    if (idlePlayers.length) {
      boardActor.send({
        type: 'ACTIVATE',
        keys: idlePlayers.map(({ userId }) => userId),
      });
    }

    return () => {
      boardActor.send({
        type: 'CLEAR',
      });
    };
  }, [idlePlayers, boardActor]);
  return null;
};

const PlayerBoardNightStatus = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );
  const isArrested = useLittleVigilanteSelector((state) => {
    return myUserId === state.currentRoundArrestedPlayerId;
  });

  const abilityGroup = useLittleVigilanteSelector(selectAbilityGroup);
  const idlePlayers = useLittleVigilanteSelector(selectIdlePlayers);

  let Component: ReactNode;

  if (abilityGroup) {
    const roles = abilityGroups[abilityGroup];
    if (roles.includes(myRole)) {
      if (!isArrested) {
        Component = nightPhaseComponentsByRole[myRole];
      } else {
        Component = <NightPhaseArrested />;
      }
    }
  }

  if (idlePlayers.length) {
    Component = <NightPlayerBoardIdleStatus />;
  }

  return (
    <Box css={{ height: !Component ? '1px' : 'auto', flexBasis: '100%' }}>
      {Component && Component}
    </Box>
  );
};

const NightPlayerBoardIdleStatus = () => {
  const idlePlayers = useLittleVigilanteSelector(selectIdlePlayers);
  return (
    <Flex gap="1" direction="column" css={{ p: '$3' }}>
      <Caption>Idle Players</Caption>

      <Text>
        <Flex gap="1">
          {idlePlayers.map((player) => (
            <Badge variant={colorBySlotNumber[player.slotNumber]}>
              {player.name}
            </Badge>
          ))}
        </Flex>
      </Text>
    </Flex>
  );
};

const NightPlayerBoardItem: FC<{ userId: string }> = ({ userId }) => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { slotNumber } = useLittleVigilanteSelector(
    (state) => state.players[userId]
  );
  const handlePressCard = useCallback(() => {
    boardActor.send({ type: 'PRESS', key: userId });
  }, [boardActor, userId]);

  const color = colorBySlotNumber[slotNumber];
  return (
    <PlayerBoardItemRoot value={userId}>
      <PlayerBoardItemCard
        onClick={handlePressCard}
        css={{
          position: 'relative',
        }}
      >
        <Box
          css={{
            p: '$1',
            background: `$${color}4`,
            borderRadius: '$2',
          }}
        >
          <PlayerBoardItemName />
          <Text size="4" css={{ fontWeight: 'bold' }}>
            &nbsp;
          </Text>
          <Box css={{ position: 'absolute', right: 0, bottom: '-35%' }}>
            <PlayerBoardItemAvatar size={'5'} />
          </Box>
        </Box>
      </PlayerBoardItemCard>
    </PlayerBoardItemRoot>
  );
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

const NightPhaseArrested = () => {
  return null;
};

const NightPhaseAnarchist = () => {
  return null;
};

const NightPhaseButler = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);

  useEffect(() => {
    const vigilante = selectVigilantePlayer(store.getSnapshot());
    const sidekick = selectSidekickPlayer(store.getSnapshot());
    boardActor.send({
      type: 'REVEAL',
      key: vigilante.userId,
      role: 'vigilante',
    });

    if (sidekick) {
      boardActor.send({
        type: 'REVEAL',
        key: sidekick.userId,
        role: 'sidekick',
      });
    }

    setTimeout(() => {
      boardActor.send({
        type: 'UNREVEAL',
        key: vigilante.userId,
        deactivate: true,
      });

      if (sidekick) {
        boardActor.send({
          type: 'UNREVEAL',
          key: sidekick.userId,
          deactivate: true,
        });
      }
    }, 3000);

    return () => {
      boardActor.send({ type: 'DISABLE' });
    };
  }, [boardActor, store]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Butler Ability</Caption>
      <Text>{abilityByRole.butler}</Text>
    </Flex>
  );
};

const NightPhaseSnitch = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();

  useEffect(() => {
    const userIds = selectPlayers(store.getSnapshot())
      .filter((player) => player.userId !== myUserId)
      .map((p) => p.userId);
    boardActor.send({ type: 'ACTIVATE', keys: userIds });

    const sub = from(boardActor)
      .pipe(
        filter((state) => state.context.selected.length === 2),
        take(1)
      )
      .subscribe((state) => {
        const { selected } = state.context;
        send({
          type: 'SWAP',
          firstUserId: selected[0],
          secondUserId: selected[1],
        });
      });

    return () => {
      boardActor.send({ type: 'DISABLE' });
      if (!sub.closed) {
        sub.unsubscribe();
      }
    };
  }, [boardActor, store, myUserId, send]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Snitch Ability</Caption>
      <Text>{abilityByRole.snitch}</Text>
    </Flex>
  );
};

const NightPhaseCop = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();

  useEffect(() => {
    const userIds = selectPlayers(store.getSnapshot())
      .filter((player) => player.userId !== myUserId)
      .map((p) => p.userId);
    boardActor.send({ type: 'ACTIVATE', keys: userIds });

    const sub = from(boardActor)
      .pipe(
        filter((state) => state.context.selected.length === 1),
        take(1)
      )
      .subscribe((state) => {
        const userId = state.context.selected[0];
        send({ type: 'ARREST', arrestedUserId: userId });
        boardActor.send({ type: 'CLEAR' });
        boardActor.send({ type: 'DISABLE' });
      });

    return () => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    };
  }, [boardActor, store, myUserId, send]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Cop Ability</Caption>
      <Text>{abilityByRole.cop}</Text>
    </Flex>
  );
};

const NightPhaseDetective = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const currentRoundRoles = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles
  );

  useEffect(() => {
    const userIds = selectPlayers(store.getSnapshot())
      .filter((player) => player.userId !== myUserId)
      .map((p) => p.userId);
    boardActor.send({ type: 'ACTIVATE', keys: userIds });

    const sub = from(boardActor)
      .pipe(
        filter((state) => state.context.selected.length === 1),
        take(1)
      )
      .subscribe((state) => {
        const userId = state.context.selected[0];
        send({
          type: 'SELECT',
          userId,
        });

        boardActor.send({ type: 'CLEAR' });
        boardActor.send({ type: 'DISABLE' });
        boardActor.send({
          type: 'REVEAL',
          key: userId,
          role: currentRoundRoles[userId] as Role,
        });
        setTimeout(() => {
          boardActor.send({ type: 'UNREVEAL', key: userId, deactivate: true });
        }, 3000);
      });

    return () => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    };
  }, [boardActor, store, myUserId, send, currentRoundRoles]);
  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Detective Ability</Caption>
      <Text>{abilityByRole.detective}</Text>
    </Flex>
  );
};
const NightPhaseMonk = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const currentRoundRoles = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles
  );

  useEffect(() => {
    const role = currentRoundRoles[myUserId] as Role;
    boardActor.send({
      type: 'REVEAL',
      key: myUserId,
      role,
    });
  }, [boardActor, store, myUserId, send, currentRoundRoles]);
  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Monk Ability</Caption>
      <Text>{abilityByRole.monk}</Text>
    </Flex>
  );
};
const NightPhaseConArtist = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();

  useEffect(() => {
    const userIds = selectPlayers(store.getSnapshot())
      .filter((player) => player.userId !== myUserId)
      .map((p) => p.userId);
    boardActor.send({ type: 'ACTIVATE', keys: userIds });

    const sub = from(boardActor)
      .pipe(
        filter((state) => state.context.selected.length === 1),
        take(1)
      )
      .subscribe((state) => {
        const { selected } = state.context;
        send({
          type: 'SWAP',
          firstUserId: myUserId,
          secondUserId: selected[0],
        });

        boardActor.send({ type: 'CLEAR' });
        boardActor.send({ type: 'DISABLE' });
      });

    return () => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    };
  }, [boardActor, store, myUserId, send]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Con Artist Ability</Caption>
      <Text>{abilityByRole.con_artist}</Text>
    </Flex>
  );
};

const NightPhaseSidekick = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);

  useEffect(() => {
    const vigilante = selectVigilantePlayer(store.getSnapshot());
    boardActor.send({
      type: 'REVEAL',
      key: vigilante.userId,
      role: 'vigilante',
    });

    return () => {
      boardActor.send({ type: 'CLEAR' });
      boardActor.send({ type: 'DISABLE' });
    };
  }, [boardActor, store]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Sidekick Ability</Caption>
      <Text>{abilityByRole.sidekick}</Text>
    </Flex>
  );
};

const NightPhaseTwinBoy = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);

  useEffect(() => {
    const twinGirl = selectTwinGirlPlayer(store.getSnapshot());
    const twinBoy = selectTwinBoyPlayer(store.getSnapshot());
    if (twinGirl) {
      boardActor.send({
        type: 'REVEAL',
        key: twinGirl.userId,
        role: 'twin_girl',
      });
    } else if (twinBoy) {
      boardActor.send({
        type: 'REVEAL',
        key: twinBoy.userId,
        role: 'twin_boy',
      });
    }

    return () => {
      boardActor.send({ type: 'CLEAR' });
      boardActor.send({ type: 'DISABLE' });
    };
  }, [boardActor, store]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Twin Ability</Caption>
      <Text>{abilityByRole.twin_boy}</Text>
    </Flex>
  );
};

const NightPhaseTwinGirl = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);

  useEffect(() => {
    const twinGirl = selectTwinGirlPlayer(store.getSnapshot());
    const twinBoy = selectTwinBoyPlayer(store.getSnapshot());
    if (twinBoy) {
      boardActor.send({
        type: 'REVEAL',
        key: twinBoy.userId,
        role: 'twin_boy',
      });
    } else if (twinGirl) {
      boardActor.send({
        type: 'REVEAL',
        key: twinGirl.userId,
        role: 'twin_girl',
      });
    }

    return () => {
      boardActor.send({ type: 'CLEAR' });
      boardActor.send({ type: 'DISABLE' });
    };
  }, [boardActor, store]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Twin Ability</Caption>
      <Text>{abilityByRole.twin_girl}</Text>
    </Flex>
  );
};

const NightPhaseVigilante = () => {
  const boardActor = useContext(PlayerBoardActorContext);
  const { store } = useContext(LittleVigilanteContext);

  useEffect(() => {
    const sidekick = selectSidekickPlayer(store.getSnapshot());
    if (sidekick) {
      boardActor.send({
        type: 'REVEAL',
        key: sidekick.userId,
        role: 'sidekick',
      });
    }

    return () => {
      boardActor.send({ type: 'CLEAR' });
      boardActor.send({ type: 'DISABLE' });
    };
  }, [boardActor, store]);

  return (
    <Flex css={{ p: '$3' }} gap="1" direction="column">
      <Caption>Vigilante Ability</Caption>
      <Text>{abilityByRole.vigilante}</Text>
    </Flex>
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

// return (
//   <PlayerBoardItemRoot value={userId}>
//     <DropdownMenu.Root>
//       <DropdownMenu.Trigger asChild>
//         <PlayerBoardItemCard
//           variant="interactive"
//           css={{
//             background: `$${colorBySlotNumber[slotNumber]}9`,
//             borderRadius: '$2 $2 0 0',
//             position: 'relative',
//             p: '$2',
//           }}
//         >
//           <PlayerBoardItemName />
//           <Box css={{ position: 'absolute', right: 0, bottom: '-50%' }}>
//             <PlayerBoardItemAvatar size={'5'} />
//           </Box>
//         </PlayerBoardItemCard>
//       </DropdownMenu.Trigger>
//       <DropdownMenu.Portal>
//         <PlayerBoardDropdownContent
//           css={{
//             width: '100%',
//             background: `$${colorBySlotNumber[slotNumber]}8`,
//             borderRadius: '0 0 $1 $1',
//           }}
//           className="dark-theme"
//         >
//           <Heading>Hello</Heading>
//         </PlayerBoardDropdownContent>
//       </DropdownMenu.Portal>
//     </DropdownMenu.Root>
//   </PlayerBoardItemRoot>
// );
