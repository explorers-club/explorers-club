import { Avatar } from '@atoms/Avatar';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { colorBySlotNumber, styled } from '@explorers-club/styles';
import { Carousel, CarouselCell } from '@molecules/Carousel';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import { KeenSliderInstance, useKeenSlider } from 'keen-slider/react';
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  colorByTeam,
  iconByRole,
  Role,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { RoleCard } from '../molecules/role-card.component';
import { CalledVote } from '../organisms/called-vote.component';

export const DiscussionPhaseScreenComponent = () => {
  const roles = useLittleVigilanteSelector((state) => state.roles as Role[]);
  const initial = Math.floor(roles.length / 2);
  const currentRoleRef = useRef<Role>(roles[initial]);

  return (
    <Flex css={{ p: '$3' }} direction="column" gap="2">
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <CountdownTimer />
          <CalledVote />
        </Flex>
      </Card>
      <Card css={{ py: '$3' }}>
        <Flex direction="column" css={{ width: '100$' }} gap="2">
          <RoleCarousel currentRoleRef={currentRoleRef} />
          <PlayerGrid currentRoleRef={currentRoleRef} />
        </Flex>
      </Card>
    </Flex>
  );
};

interface RoleCarouselProps {
  currentRoleRef: MutableRefObject<Role>;
}

const RoleCarousel: FC<RoleCarouselProps> = ({ currentRoleRef }) => {
  const roles = useLittleVigilanteSelector((state) => state.roles as Role[]);
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
        <Carousel sliderRef={sliderRef}>
          {roles.map((role, index) => (
            <RoleCell
              role={role}
              key={index}
              index={index}
              onPress={handleOnPress}
            />
          ))}
        </Carousel>
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
      <CarouselCell
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
          <Avatar
            size="5"
            src={iconByRole[role as Role]}
            css={{
              border: `3px ${roleTargetColor ? 'solid' : 'dashed'} $${
                roleTargetColor ? roleTargetColor : 'neutral'
              }9`,
              borderRadius: '50%',
            }}
          />
          <Caption variant="contrast">{role}</Caption>
        </Flex>
      </CarouselCell>
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

  const handlePressPlayer = useCallback(
    (userId: string) => {
      send({
        type: 'TARGET_ROLE',
        targetedUserId: userId,
        role: currentRoleRef.current,
      });
    },
    [send, currentRoleRef]
  );

  return (
    <Box>
      <Grid
        css={{
          width: '100%',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '$2',
          px: '$3',
        }}
      >
        {players.map(({ userId }) => (
          <PlayerGridItem
            key={userId}
            userId={userId}
            onPress={handlePressPlayer}
          />
        ))}
      </Grid>
    </Box>
  );
};

const PlayerGridItem = ({
  userId,
  onPress,
}: {
  userId: string;
  onPress: (userId: string) => void;
}) => {
  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  const { name, slotNumber } = player;

  const roleTargets = useLittleVigilanteSelector((state) => {
    const roleTargets = selectRoleTargetsByUserId(state);
    return roleTargets[player.userId] || [];
  });

  const handlePress = useCallback(() => {
    onPress(userId);
  }, [userId, onPress]);

  return (
    <Card
      key={userId}
      css={{
        px: '$1',
        background: '$primary3',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={handlePress}
    >
      <Flex
        direction="column"
        wrap="wrap"
        css={{
          position: 'absolute',
          zIndex: 1,
          left: '$1',
          top: '$1',
          height: '100%',
        }}
        gap="1"
      >
        {roleTargets.map(({ targetingUserId, role }, index) => (
          <PlayerRoleTarget
            key={index}
            targetingUserId={targetingUserId}
            role={role}
          />
        ))}
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        css={{ aspectRatio: 1 }}
        gap="2"
      >
        <Avatar
          css={{
            boxShadow: `0px 3px 6px $colors$${colorBySlotNumber[slotNumber]}9,
                        0px 2px 1px $colors$${colorBySlotNumber[slotNumber]}11`,
            borderRadius: '50%',
            border: `3px solid $${colorBySlotNumber[slotNumber]}8`,
          }}
          size="6"
          variant={colorBySlotNumber[slotNumber]}
        />
        <Heading>{name}</Heading>
      </Flex>
    </Card>
  );
};

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
  const color = colorBySlotNumber[slotNumber];
  return (
    <Avatar
      size="2"
      src={iconByRole[role]}
      css={{
        border: `3px solid $${color}7`,
        borderRadius: '50%',
      }}
    />
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

const CountdownTimer = () => {
  const formattedTime = useLittleVigilanteSelector(selectFormattedTime);

  return (
    <Heading css={{ textAlign: 'center', fontFamily: '$mono' }} size="3">
      {formattedTime}
    </Heading>
  );
};

const selectFormattedTime = (state: LittleVigilanteStateSerialized) =>
  formatTime(state.timeRemaining);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}
