import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { colorBySlotNumber, styled } from '@explorers-club/styles';
import { Slider, SliderCell } from '@molecules/Slider';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import { KeenSliderInstance, useKeenSlider } from 'keen-slider/react';
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  colorByTeam,
  displayNameByRole,
  Role,
  roleOrderIndex,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import {
  selectIsVoteCalled,
  selectIsVoteFailed,
} from '../../state/little-vigilante.selectors';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { RoleAvatar } from '../molecules/role-avatar.component';
import { RoleCard } from '../molecules/role-card.component';
import { Chat } from '../organisms/chat.component';

export const DiscussionPhaseScreenComponent = () => {
  const myUserId = useMyUserId();
  const myInitialRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId] as Role
  );
  const roles = useLittleVigilanteSelector((state) => state.roles as Role[]);
  const initial = roles.indexOf(myInitialRole);
  const currentRoleRef = useRef<Role>(roles[initial]);
  const isVoteFailed = useLittleVigilanteSelector(selectIsVoteFailed);
  const isVoteCalled = useLittleVigilanteSelector(selectIsVoteCalled);
  const isVoteOngoing = isVoteFailed || isVoteCalled;

  return (
    <Flex direction="column" gap="1" css={{ minHeight: '100%' }}>
      {/* <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <CountdownTimer />
          <CalledVote />
        </Flex>
      </Card> */}
      <Card css={{ py: '$3' }}>
        <Flex direction="column" gap="2">
          {isVoteOngoing ? (
            isVoteCalled ? (
              <VoteCalled />
            ) : (
              <VoteFailed />
            )
          ) : (
            <>
              <RoleCarousel currentRoleRef={currentRoleRef} />
              <PlayerGrid currentRoleRef={currentRoleRef} />
            </>
          )}
        </Flex>
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat />
      </Card>
    </Flex>
  );
};

interface RoleCarouselProps {
  currentRoleRef: MutableRefObject<Role>;
}

const RoleCarousel: FC<RoleCarouselProps> = ({ currentRoleRef }) => {
  const roles = useLittleVigilanteSelector((state) => {
    const roles = state.roles as Role[];
    roles.sort((a, b) => roleOrderIndex[a] - roleOrderIndex[b]);
    return roles;
  });
  const roleRef = useRef<Role | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: roles.indexOf(currentRoleRef.current),
    mode: 'free-snap',
    slideChanged(slider) {
      slider.slides.forEach((slide) => slide.classList.remove('active'));
      slider.slides[slider.track.details.rel].classList.add('active');
      currentRoleRef.current = roles[slider.track.details.rel];
      setPopoverOpen(false);
    },
    created(slider) {
      slider.slides[slider.track.details.rel].classList.add('active');
    },
    slides: {
      origin: 'center',
      perView: 4,
    },
  });

  const handleOnPress = useCallback(
    (role: Role, index: number) => {
      if (!instanceRef.current) {
        return;
      }
      const currentIndex = instanceRef.current.track.details.rel;
      if (index === currentIndex) {
        roleRef.current = role;
        setPopoverOpen(true);
      } else {
        instanceRef.current?.moveToIdx(index);
      }
    },
    [instanceRef, roleRef, setPopoverOpen]
  );

  return (
    <Box css={{ position: 'relative' }}>
      <Popover.Root
        open={popoverOpen}
        onOpenChange={(val) => setPopoverOpen(val)}
      >
        <RolePopoverAnchor instanceRef={instanceRef} />
        <Popover.Portal>
          <RolePopoverContent
            className={'dark-theme' /* todo: theme context */}
          >
            <RoleCardContainer roleRef={roleRef} />
          </RolePopoverContent>
        </Popover.Portal>
        <Slider sliderRef={sliderRef}>
          {roles.map((role, index) => (
            <RoleCell
              role={role}
              key={index}
              index={index}
              onPress={handleOnPress}
            />
          ))}
        </Slider>
      </Popover.Root>
    </Box>
  );
};

const RoleCardContainer = ({
  roleRef,
}: {
  roleRef: MutableRefObject<Role | null>;
}) => {
  const role = useMemo(
    () => (roleRef.current ? roleRef.current : 'detective'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleRef.current]
  );
  const teamColor = useMemo(() => {
    const team = teamByRole[role];
    return colorByTeam[team];
  }, [role]);

  return (
    <Box css={{ position: 'relative' }}>
      <Popover.Arrow width={20} height={10} />
      <RolePopoverClose>
        <Cross2Icon />
      </RolePopoverClose>
      <RoleCard
        css={{
          border: `2px solid $colors$${teamColor}2`,
          boxShadow: `0px 12px 24px $colors$${teamColor}9, 0px 2px 1px $colors$${teamColor}3`,
        }}
        role={role}
      />
    </Box>
  );
};

const RolePopoverClose = styled(Popover.Close, {
  position: 'absolute',
  zIndex: 300,
  top: '$1',
  right: '$1',
  borderRadius: '$2',
  height: '44px',
  width: '44px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0,0,0,.3)',
  color: 'white',
  outline: 'none',
  border: 'none',

  '&:hover': {
    background: 'rgba(0,0,0,.4)',
  },
});

interface Props {
  instanceRef: MutableRefObject<KeenSliderInstance | null>;
}

const RolePopoverAnchor: FC<Props> = ({ instanceRef }) => {
  const [topOffset, setTopOffset] = useState(120);
  useEffect(() => {
    if (!instanceRef.current) {
      return;
    }
    const currentIndex = instanceRef.current.track.details.rel;
    const el = instanceRef.current.slides[currentIndex];
    const { height } = el.getBoundingClientRect();
    setTopOffset(height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceRef.current, setTopOffset]);

  return (
    <Box
      css={{
        position: 'absolute',
        left: '50%',
        top: topOffset,
        mt: '$3',
      }}
    >
      <Popover.Anchor />
    </Box>
  );
};

const RolePopoverContent = styled(Popover.Content, {
  zIndex: 200,
  minWidth: 200,
  maxWidth: 265,
  '&:focus': {
    outline: 'none',
  },
});

const RoleCell = memo(
  ({
    role,
    index,
    onPress,
  }: {
    role: Role;
    index: number;
    onPress: (role: Role, index: number) => void;
  }) => {
    const { event$ } = useContext(LittleVigilanteContext);
    const myUserId = useMyUserId();

    const handleOnPress = useCallback(() => {
      onPress(role, index);
    }, [onPress, role, index]);
    const roleTargetColor = useLittleVigilanteSelector((state) => {
      const myRoleTargets = state.players[myUserId].currentRoundRoleTargets;
      const target = Object.entries(myRoleTargets).find(
        ([, roleTarget]) => roleTarget === role
      );
      if (target) {
        const userId = target[0];
        const { slotNumber } = state.players[userId];
        return colorBySlotNumber[slotNumber];
      }
      return null;
    });

    return (
      <SliderCell
        css={{
          opacity: 0.5,
          '&.active': {
            opacity: 1,
            overflow: 'visible !important',
            [`& ${Caption}`]: {
              opacity: 1,
            },
          },
          [`& ${Caption}`]: {
            opacity: 0,
          },
          transition: 'opacity 200ms ease-in-out',
        }}
      >
        <Flex
          onClick={handleOnPress}
          direction="column"
          justify="center"
          align="center"
          gap="2"
        >
          <RoleAvatar size={5} roleType={role} />
          <Caption variant="contrast">{role}</Caption>
        </Flex>
      </SliderCell>
    );
  }
);

interface PlayerGridProps {
  currentRoleRef: MutableRefObject<Role>;
}

const PlayerGrid: FC<PlayerGridProps> = ({ currentRoleRef }) => {
  const send = useLittleVigilanteSend();
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );

  return (
    <Box
      css={{
        background: '$primary6',
      }}
    >
      <Flex wrap="wrap">
        {players.map(({ userId }) => (
          <PlayerGridItem
            key={userId}
            userId={userId}
            currentRoleRef={currentRoleRef}
          />
        ))}
      </Flex>
    </Box>
  );
};

const PlayerGridItem = ({
  userId,
  currentRoleRef,
}: {
  userId: string;
  currentRoleRef: MutableRefObject<Role>;
}) => {
  const send = useLittleVigilanteSend();
  const [currentRole, setCurrentRole] = useState(currentRoleRef.current);

  const handleOpen = useCallback(() => {
    // hack to fix component not-rerendering when role changes
    setCurrentRole(currentRoleRef.current);
  }, [setCurrentRole, currentRoleRef]);

  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  const { name, slotNumber } = player;

  const roleTargets = useLittleVigilanteSelector((state) => {
    const roleTargets = selectRoleTargetsByUserId(state);
    return roleTargets[player.userId] || [];
  });

  const handlePressMark = useCallback(() => {
    send({
      type: 'TARGET_ROLE',
      targetedUserId: userId,
      role: currentRoleRef.current,
    });
  }, [send, userId, currentRoleRef]);

  const handleCallVote = useCallback(() => {
    send({
      type: 'CALL_VOTE',
      targetedUserId: userId,
    });
  }, [send, userId]);

  return (
    <Box css={{ flexBasis: '50%' }}>
      <DropdownMenu.Root onOpenChange={handleOpen}>
        <DropdownMenu.Trigger asChild>
          <Card
            key={userId}
            variant="interactive"
            css={{
              flex: 1,
              height: '64px',
              position: 'relative',
            }}
          >
            <Box css={{ p: '$1' }}>
              <Flex direction="column">
                <Heading
                  css={{ fontSize: '$2' }}
                  variant={colorBySlotNumber[slotNumber]}
                >
                  {name}
                </Heading>
                <Flex>
                  {roleTargets
                    .slice(0, 3)
                    .map(({ targetingUserId, role }, index) => (
                      <PlayerRoleTarget
                        key={index}
                        targetingUserId={targetingUserId}
                        role={role}
                      />
                    ))}
                </Flex>
              </Flex>
              <Box css={{ position: 'absolute', top: 0, right: 0 }}>
                <PlayerAvatar
                  size="4"
                  userId={userId}
                  color={colorBySlotNumber[slotNumber]}
                />
              </Box>
            </Box>
          </Card>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <PlayerMenuContent className="dark-theme">
            <Card css={{ p: '$1' }}>
              <Flex direction="column" gap="1">
                <Heading variant={colorBySlotNumber[slotNumber]}>
                  {name}
                </Heading>
                <PlayerMenuItem onSelect={handlePressMark}>
                  <Text>
                    Mark as <strong>{displayNameByRole[currentRole as Role]}</strong>
                  </Text>
                </PlayerMenuItem>
                <PlayerMenuItem onSelect={handleCallVote}>
                  <Text>
                    <strong>Call Vote</strong> to Identify
                  </Text>
                </PlayerMenuItem>
              </Flex>
            </Card>
          </PlayerMenuContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </Box>
  );
};

const PlayerMenuContent = styled(DropdownMenu.Content, {
  minWidth: '100px',
  zIndex: 10,
  p: '$2',
});

const PlayerMenuItem = styled(DropdownMenu.Item, {
  backgroundColor: '$primary4',
  px: '$4',
  py: '$2',
  borderRadius: '$2',
  textAlign: 'center',

  [`${Text}`]: {
    fontSize: '$5',
  },
});

const PlayerRoleTarget = ({
  targetingUserId,
  role,
}: {
  targetingUserId: string;
  role: Role;
}) => {
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[targetingUserId].slotNumber
  );
  return (
    <Box
      css={{
        width: 'fit-content',
        height: 'fit-content',
        position: 'relative',
      }}
    >
      <RoleAvatar size="2" roleType={role} />
      <Box
        css={{
          width: '$2',
          height: '$2',
          bottom: 0,
          right: 0,
          position: 'absolute',
          borderRadius: '$2',
          zIndex: 5,
          background: `$${colorBySlotNumber[slotNumber]}9`,
        }}
      />
    </Box>
  );
};

const selectRoleTargetsByUserId = (state: LittleVigilanteStateSerialized) => {
  const players = Object.values(state.players);
  const roleTargetsByUserId: Record<
    string,
    { targetingUserId: string; role: Role }[]
  > = {};
  Object.values(players).forEach((player) => {
    Object.entries(player.currentRoundRoleTargets).forEach(([userId, role]) => {
      roleTargetsByUserId[userId] ||= [];
      roleTargetsByUserId[userId].push({
        targetingUserId: player.userId,
        role: role as Role,
      });
    });
  });
  return roleTargetsByUserId;
};

const VoteCalled = () => {
  const myUserId = useMyUserId();
  const isVoteSubmitted = useLittleVigilanteSelector(
    ({ calledVoteResponses }) => myUserId in calledVoteResponses
  );

  const [callingPlayer, targetedPlayer] = useLittleVigilanteSelector(
    (state) => [
      state.players[state.calledVoteUserId],
      state.players[state.calledVoteTargetedUserId],
    ]
  );

  const send = useLittleVigilanteSend();
  const [voted, setVoted] = useState(false);

  const onPressNo = useCallback(() => {
    send({ type: 'REJECT_VOTE' });
    setVoted(true);
  }, [send, setVoted]);

  const onPressYes = useCallback(() => {
    send({ type: 'APPROVE_VOTE' });
    setVoted(true);
  }, [send, setVoted]);

  if (isVoteSubmitted) {
    return <VoteSubmitted />;
  }

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Heading>
        Identify{' '}
        <Text
          variant={colorBySlotNumber[targetedPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {targetedPlayer.name}
        </Text>
        ?
      </Heading>
      <Text>
        <Text
          variant={colorBySlotNumber[callingPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {callingPlayer.name}
        </Text>{' '}
        called a vote to identify{' '}
        <Text
          variant={colorBySlotNumber[targetedPlayer.slotNumber]}
          css={{ display: 'inline', fontWeight: 'bold' }}
        >
          {targetedPlayer.name}
        </Text>{' '}
        as a vigilante. Continue?
      </Text>
      <Flex css={{ width: '100%', justifyContent: 'stretch' }} gap="2">
        <Button
          color="primary"
          size="3"
          css={{ flexGrow: '1' }}
          onClick={onPressNo}
          disabled={voted}
        >
          No
        </Button>
        <Button
          color="primary"
          size="3"
          css={{ flexGrow: '1' }}
          onClick={onPressYes}
          disabled={voted}
        >
          Yes
        </Button>
      </Flex>
      <Caption css={{ lineHeight: '125%' }}>
        Voting to identify {targetedPlayer.name} will end the round.
        <br />A majority must say yes to proceed.
      </Caption>
    </Flex>
  );
};

const VoteSubmitted = () => {
  const numVotes = useLittleVigilanteSelector(
    (state) => Object.values(state.calledVoteResponses).length
  );
  const numPlayers = useLittleVigilanteSelector(
    (state) => Object.values(state.players).length
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Waiting for results</Caption>
      <Heading>Vote Submitted</Heading>
      <Text>
        <strong>{numVotes}</strong> / {numPlayers} players have voted
      </Text>
    </Flex>
  );
};

const VoteFailed = () => {
  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Heading>Vote Rejected</Heading>
      <Text>The round will continue.</Text>
    </Flex>
  );
};
