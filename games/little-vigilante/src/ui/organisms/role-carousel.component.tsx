import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';

import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import {
  LittleVigilanteStateSerialized,
  LittleVigilanteStore,
} from '@explorers-club/room';
import { colorBySlotNumber } from '@explorers-club/styles';
import { Carousel, CarouselCell } from '@molecules/Carousel';
import { KeenSliderInstance, useKeenSlider } from 'keen-slider/react';
import {
  FC,
  memo,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import {
  abilityByRole,
  colorByTeam,
  displayNameByRole,
  iconByRole,
  imageByRole,
  objectiveByRole,
  primaryColorByRole,
  Role,
  secondaryColorByRole,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { NightPhaseAnarchist } from '../molecules/night-phase-anarchist.container';
import { NightPhaseArrested } from '../molecules/night-phase-arrested.component';
import { NightPhaseButler } from '../molecules/night-phase-butler.container';
import { NightPhaseConspirator } from '../molecules/night-phase-conspirator.container';
import { NightPhaseCop } from '../molecules/night-phase-cop.container';
import { NightPhaseDetective } from '../molecules/night-phase-detective.container';
import { NightPhaseMonk } from '../molecules/night-phase-monk.container';
import { NightPhasePolitician } from '../molecules/night-phase-politician.container';
import { NightPhaseSidekick } from '../molecules/night-phase-sidekick.container';
import { NightPhaseTwinBoy } from '../molecules/night-phase-twin-boy.container';
import { NightPhaseTwinGirl } from '../molecules/night-phase-twin-girl.container';
import { NightPhaseVigilante } from '../molecules/night-phase-vigilante.container';

export const RoleCarousel = () => {
  const roles = useLittleVigilanteSelector((state) => state.roles as Role[]);

  const myUserId = useMyUserId();
  const { store } = useContext(LittleVigilanteContext);
  const [store$] = useState(fromStore(store));
  const myRole = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles[myUserId] as Role
  );

  const [startingRole] = useState(myRole);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: roles.indexOf(startingRole),
    mode: 'free-snap',
    slideChanged(slider) {
      const index = slider.track.details.rel;
      slider.slides.forEach((slide, slideIndex) => {
        const role = roles[slideIndex];
        const currentRole = roles[index];

        if (role === currentRole) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    },
    animationEnded(slider) {
      const index = slider.track.details.rel;
      detailedInstanceRef.current?.moveToIdx(index);
    },
    created(slider) {
      slider.slides[slider.track.details.rel].classList.add('active');

      const sub = store$
        .pipe(map(selectRolesInFocus), distinctUntilChanged())
        .subscribe((rolesInFocus) => {
          slider.slides.forEach((slide, slideIndex) => {
            // console.log('slides', slideIndex, roles.length);
            const role = roles[slideIndex];
            const isFocused = rolesInFocus.includes(role);
            if (isFocused) {
              slide.classList.add('focused');

              if (startingRole === role) {
                instanceRef.current?.moveToIdx(slideIndex);
                detailedInstanceRef.current?.moveToIdx(slideIndex);
                // console.log('moving to', slideIndex);
                // if (instanceRef.current) {
                //   instanceRef.current.options.drag = false;
                // }
              }
            } else {
              slide.classList.remove('focused');
            }
          });
        });

      slider.on('destroyed', () => {
        sub.unsubscribe();
      });
    },
    slides: {
      origin: 'center',
      perView: 4.5,
    },
  });

  const [detailedSliderRef, detailedInstanceRef] =
    useKeenSlider<HTMLDivElement>({
      initial: roles.indexOf(myRole),
      mode: 'free-snap',
      slideChanged(slider) {
        slider.slides.forEach((slide) => slide.classList.remove('active'));
        slider.slides[slider.track.details.rel].classList.add('active');
      },
      animationEnded(slider) {
        const index = slider.track.details.rel;
        instanceRef.current?.moveToIdx(index);
      },
      created(slider) {
        slider.slides[slider.track.details.rel].classList.add('active');
      },
      slides: {
        origin: 'center',
        perView: 1.2,
        spacing: 15,
      },
    });

  const handleOnPress = useCallback(
    (role: Role, index: number) => {
      if (!instanceRef.current) {
        return;
      }
      const currentIndex = instanceRef.current.track.details.rel;
      if (index === currentIndex) {
        // roleRef.current = role;
      } else {
        instanceRef.current?.moveToIdx(index);
      }
    },
    [instanceRef]
  );

  return (
    <Box css={{ position: 'relative', py: '$4' }}>
      <Carousel sliderRef={sliderRef}>
        {roles.map((role, index) => (
          <RoleCell
            role={role}
            key={index}
            index={index}
            instanceRef={instanceRef}
            isStartingRole={role === startingRole}
            onPress={handleOnPress}
          />
        ))}
      </Carousel>
      <Carousel sliderRef={detailedSliderRef}>
        {roles.map((role, index) => (
          <DetailedRoleCell role={role} key={index} index={index} />
        ))}
      </Carousel>
    </Box>
  );
};

const DetailedRoleCell: FC<{ role: Role; index: number }> = ({
  role,
  index,
}) => {
  const imageSrc = imageByRole[role];
  const iconSrc = iconByRole[role];
  const ability = abilityByRole[role];
  const objective = objectiveByRole[role];
  const myUserId = useMyUserId();

  const roleIsActive = useLittleVigilanteSelector((state) => {
    const focusedRoles = selectRolesInFocus(state);
    return focusedRoles.includes(role);
  });
  const isArrested = useLittleVigilanteSelector((state) => {
    return myUserId === state.currentRoundArrestedPlayerId;
  });
  const startingRole = useLittleVigilanteSelector(
    (state) => state.initialCurrentRoundRoles[myUserId]
  );
  const NightPhaseComponent =
    role === startingRole && roleIsActive ? (
      !isArrested ? (
        nightPhaseComponentsByRole[role]
      ) : (
        <NightPhaseArrested />
      )
    ) : null;

  const team = teamByRole[role];
  const teamColor = colorByTeam[team];
  return (
    <CarouselCell
      css={{
        opacity: 0.5,
        '&.active': {
          opacity: 1,
        },
        transition: 'opacity 200ms ease-in-out',
        // background: '$amber9',
      }}
    >
      <Flex
        css={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '$4',
        }}
        direction="column"
      >
        <Image
          css={{
            aspectRatio: 1,
            width: '100%',
            my: NightPhaseComponent ? '-35%' : 0,
            transition: "margin 200ms ease-out"
          }}
          src={imageSrc}
          alt={role}
        />
        {NightPhaseComponent ? (
          <Card css={{ p: '$3', background: 'black' }}>
            {NightPhaseComponent}
          </Card>
        ) : (
          <Flex
            css={{
              width: '100%',
              p: '$3',
              transform: 'translateY(-40px)',
              mb: '-40px',
              background: 'black',
            }}
            direction="column"
            gap="2"
          >
            <Flex justify="between">
              <Heading size="3">{displayNameByRole[role]}</Heading>
              <Box
                css={{
                  background: primaryColorByRole[role],
                  border: `1px solid ${secondaryColorByRole[role]}`,
                  borderRadius: '2px',
                }}
              >
                <Avatar size="3" src={iconSrc} />
              </Box>
            </Flex>
            <Badge variant={teamColor}>{team}</Badge>
            <Caption>Ability</Caption>
            <Text>{ability}</Text>
            <Caption>Objective</Caption>
            <Text>{objective}</Text>
          </Flex>
        )}
      </Flex>
    </CarouselCell>
  );
};

const RoleCell = memo(
  ({
    role,
    index,
    onPress,
    isStartingRole,
  }: {
    role: Role;
    index: number;
    onPress: (role: Role, index: number) => void;
    instanceRef: MutableRefObject<KeenSliderInstance | null>;
    isStartingRole: boolean;
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
          py: '$4',
          opacity: 0.5,
          backgroundColor: 'rgba(255,255,255,0)',
          '&.focused': {
            backgroundColor: 'rgba(255,255,255,.15)',
          },
          '&.active': {
            opacity: 1,
            overflow: 'visible !important',
            [`& ${Caption}`]: {
              opacity: 1,
            },
          },
          [`& ${Caption}`]: {
            opacity: 0.2,
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
          css={{ textAlign: 'center' }}
        >
          <Caption
            style={{ visibility: isStartingRole ? 'visible' : 'hidden' }}
          >
            Starting As
          </Caption>
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
          <Caption variant="contrast">{displayNameByRole[role]}</Caption>
        </Flex>
      </CarouselCell>
    );
  }
);

const nightPhaseComponentsByRole: Partial<Record<Role, ReactNode>> = {
  anarchist: <NightPhaseAnarchist />,
  butler: <NightPhaseButler />,
  conspirator: <NightPhaseConspirator />,
  cop: <NightPhaseCop />,
  detective: <NightPhaseDetective />,
  monk: <NightPhaseMonk />,
  politician: <NightPhasePolitician />,
  sidekick: <NightPhaseSidekick />,
  twin_boy: <NightPhaseTwinBoy />,
  twin_girl: <NightPhaseTwinGirl />,
  vigilante: <NightPhaseVigilante />,
};

// tood infer type or us just `from` but not happy with store type
function fromStore(store: LittleVigilanteStore) {
  return new Observable<LittleVigilanteStateSerialized>(function (observer) {
    observer.next(store.getSnapshot());

    const unsubscribe = store.subscribe(function () {
      observer.next(store.getSnapshot());
    });
    return unsubscribe;
  });
}

// const selectRoleIndexTargetColrs = (state: LittleVigilanteStateSerialized) => {
//   const allTargets = state.pla
//   state.roles
// }

const selectRolesInFocus = (state: LittleVigilanteStateSerialized) => {
  switch (true) {
    case state.currentStates.includes('Playing.Round.NightPhase.Cop'):
      return ['cop'];
    case state.currentStates.includes('Playing.Round.NightPhase.Vigilante'):
      return ['vigilante'];
    case state.currentStates.includes('Playing.Round.NightPhase.Twins'):
      return ['twin_boy', 'twin_girl'];
    case state.currentStates.includes('Playing.Round.NightPhase.Butler'):
      return ['butler'];
    case state.currentStates.includes('Playing.Round.NightPhase.Detective'):
      return ['detective'];
    case state.currentStates.includes('Playing.Round.NightPhase.Conspirator'):
      return ['conspirator'];
    case state.currentStates.includes('Playing.Round.NightPhase.Politician'):
      return ['politician'];
    case state.currentStates.includes('Playing.Round.NightPhase.Sidekick'):
      return ['sidekick'];
    case state.currentStates.includes('Playing.Round.NightPhase.Mayor'):
      return ['mayor'];
    case state.currentStates.includes('Playing.Round.NightPhase.Anarchist'):
      return ['anarchist'];
    case state.currentStates.includes('Playing.Round.NightPhase.Monk'):
      return ['monk'];
    default:
      return [];
  }
};
