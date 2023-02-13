import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
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
    <Slider sliderRef={sliderRef}>
      {Object.entries(abilityGroups).map(([ability, roles]) => {
        return (
          <SliderCell key={ability}>
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
          </SliderCell>
        );
      })}
    </Slider>
  );
};
