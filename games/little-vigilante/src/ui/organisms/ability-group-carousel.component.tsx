import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Slider, SliderCell } from '@molecules/Slider';
import { useKeenSlider } from 'keen-slider/react';
import { useContext } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { colorByTeam, teamByRole } from '../../meta/little-vigilante.constants';
import { LittleVigilanteContext } from '../../state/little-vigilante.context';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import {
  selectAbilityGroup,
  selectAbilityGroups,
} from '../../state/little-vigilante.selectors';
import { RoleAvatar } from '../molecules/role-avatar.component';

export const AbilityGroupCarousel = () => {
  const { store, event$ } = useContext(LittleVigilanteContext);
  const abilityGroups = useLittleVigilanteSelector(selectAbilityGroups);
  const abilityGroup = useLittleVigilanteSelector(selectAbilityGroup);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: abilityGroup
      ? 1 + Object.keys(abilityGroups).indexOf(abilityGroup)
      : 0,
    mode: 'free-snap',
    slideChanged(slider) {
      slider.slides.forEach((slide) => slide.classList.remove('active'));
      slider.slides[slider.track.details.rel].classList.add('active');
    },
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
            instanceRef.current?.moveToIdx(1 + index);
          }
        });
    },
    drag: false,
    slides: {
      origin: 'center',
      perView: 2.5,
      spacing: 10,
    },
  });
  return (
    <Slider sliderRef={sliderRef}>
      <SliderCell
        css={{
          background: '$primary1',
          opacity: 0.2,
          '&.active': {
            opacity: 1,
          },
        }}
      >
        <Flex
          css={{
            position: 'absolute',
            display: 'flex',
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            p: '$2',
          }}
          align="center"
          justify="center"
        >
          <Heading>Starting</Heading>
        </Flex>
      </SliderCell>
      {Object.entries(abilityGroups).map(([ability, roles]) => {
        return (
          <SliderCell
            key={ability}
            css={{
              opacity: 0.2,
              '&.active': {
                opacity: 1,
              },
            }}
          >
            <Flex
              direction="column"
              align="center"
              css={{
                p: '$1',
                background: '$primary1',
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
          </SliderCell>
        );
      })}
    </Slider>
  );
};
