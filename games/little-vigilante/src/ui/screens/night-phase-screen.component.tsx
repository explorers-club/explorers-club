/* eslint-disable jsx-a11y/aria-role */
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { colorBySlotNumber } from '@explorers-club/styles';
import { Carousel, CarouselCell } from '@molecules/Carousel';
import { useKeenSlider } from 'keen-slider/react';
import { useCallback, useContext } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import {
  selectAbilityGroup,
  selectAbilityGroups,
} from '../../state/little-vigilante.selectors';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { RoleAvatar } from '../molecules/role-avatar.component';
import { Chat } from '../organisms/chat.component';
import { NightActions } from '../organisms/night-actions';
import { colorByTeam, teamByRole } from '../../meta/little-vigilante.constants';

export const NightPhaseScreenComponent = () => {
  console.log('phase screen render');
  // const states = useLittleVigilanteSelector((state) => state.currentStates);
  // const myUserId = useMyUserId();
  // const currentRole = useLittleVigilanteSelector(
  //   (state) => state.currentRoundRoles[myUserId]
  // );
  // const [initialRole] = useState(currentRole);
  // const arresteduserId = useLittleVigilanteSelector(
  //   (state) => state.currentRoundArrestedPlayerId
  // );

  return (
    <Flex
      direction="column"
      gap="1"
      css={{ minHeight: '100%', maxHeight: '100%' }}
    >
      <Card css={{ flex: '0 0 120px' }}>
        <Flex>
          {/* <StartingRole /> */}
          <RoleCarousel />
        </Flex>
      </Card>
      <Card>
        <NightActions />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat disabled />
      </Card>
    </Flex>
  );
};

const StartingRole = () => {
  return <Caption>Starting</Caption>;
};

const RoleCarousel = () => {
  const { store, event$ } = useContext(LittleVigilanteContext);
  const abilityGroups = useLittleVigilanteSelector(selectAbilityGroups);
  const abilityGroup = useLittleVigilanteSelector(selectAbilityGroup);
  console.log({ abilityGroups, abilityGroup });

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: abilityGroup
      ? Object.keys(abilityGroups).indexOf(abilityGroup)
      : 0,
    mode: 'free-snap',
    created(slider) {
      slider.slides[slider.track.details.rel].classList.add('active');

      event$
        .pipe(
          map((event) => selectAbilityGroup(store.getSnapshot())),
          distinctUntilChanged()
        )
        .subscribe((abilityGroup) => {
          if (abilityGroup) {
            const index = Object.keys(abilityGroups).indexOf(abilityGroup);
            instanceRef.current?.moveToIdx(index);
          }
        });
    },
    drag: false,
    slides: {
      origin: 'center',
      perView: 1.8,
      spacing: 10,
    },
  });
  return (
    <Carousel sliderRef={sliderRef}>
      {Object.entries(abilityGroups).map(([ability, roles]) => {
        return (
          <CarouselCell key={ability}>
            <Flex
              direction="column"
              align="center"
              css={{
                p: '$1',
                background: '$primary3',
                borderRadius: '$1',
                mt: '$2',
              }}
              gap="2"
            >
              <Flex gap="1">
                {roles.map((role) => {
                  const team = teamByRole[role];
                  const color = colorByTeam[team];
                  const colorToTheme = {
                    magenta: 'crimson',
                    cyan: 'cyan',
                    gold: 'amber',
                  };
                  const themeColor = `$${colorToTheme[color]}`;
                  return (
                    <RoleAvatar
                      css={{
                        border: `2px solid ${themeColor}9`,
                        borderRadius: '50%',
                        filter: `drop-shadow(0px 2px 4px $colors${themeColor}9)`,
                      }}
                      size="5"
                      roleType={role}
                    />
                  );
                })}
              </Flex>
              <Caption>{ability}</Caption>
            </Flex>
          </CarouselCell>
        );
      })}
    </Carousel>
  );
};

const PlayerStatus = () => {
  const players = useLittleVigilanteSelector((state) => state.players);
  const lastDownState = useLittleVigilanteSelector(
    (state) => state.lastDownState
  );
  const isPaused = useLittleVigilanteSelector((state) =>
    state.currentStates.includes('Playing.Round.NightPhase.RunState.Paused')
  );
  return (
    <Flex>
      <Heading>{isPaused ? 'Paused' : 'Playing'}</Heading>
      {Object.entries(players).map(([userId, player]) => (
        <PlayerAvatar
          key={userId}
          userId={userId}
          color={colorBySlotNumber[player.slotNumber]}
          css={{
            opacity: lastDownState[userId] ? 1 : 0.2,
            transition: 'opacity 5s ease-out',
          }}
        />
      ))}
    </Flex>
  );
};

const Controls = () => {
  const send = useLittleVigilanteSend();

  const handlePressDown = useCallback(() => {
    send({ type: 'PRESS_DOWN' });
  }, [send]);

  const handlePressUp = useCallback(() => {
    send({ type: 'PRESS_UP' });
  }, [send]);

  return (
    <Button
      onPointerDown={handlePressDown}
      onPointerUp={handlePressUp}
      color="primary"
      size="3"
      css={{
        borderRadius: '50%',
      }}
    >
      Go
    </Button>
  );
};

// function fromStore(store: LittleVigilanteStore) {
//   return new Observable<LittleVigilanteStateSerialized>(function (observer) {
//     observer.next(store.getSnapshot());

//     const unsubscribe = store.subscribe(function () {
//       observer.next(store.getSnapshot());
//     });
//     return unsubscribe;
//   });
// }
