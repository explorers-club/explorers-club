import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { rolesByPlayerCount } from '../../meta/little-vigilante.constants';
import { withLittleVigilanteContext } from '../../test/withLittleVigilanteContext';
import { RoleCarousel } from './role-carousel.component';

export default {
  component: RoleCarousel,
  decorators: [withCardDecorator],
  parameters: {
    cardCSS: {
      p: '$0',
    },
  },
};

export const TeamVigilante = () => {
  return <RoleCarousel roles={['vigilante', 'sidekick', 'butler']} />;
};

export const TeamAnarchist = () => {
  return <RoleCarousel roles={['anarchist']} />;
};

export const TeamCitizens = () => {
  return (
    <RoleCarousel
      roles={[
        'detective',
        'snitch',
        'twin_girl',
        'twin_boy',
        'con_artist',
        'cop',
        'monk',
        'mayor',
      ]}
    />
  );
};
