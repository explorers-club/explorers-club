import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseTwinGirlComponent } from './night-phase-twin-girl.component';

export default {
  component: NightPhaseTwinGirlComponent,
  decorators: [withCardDecorator],
} as Meta;

const Template: ComponentStory<typeof NightPhaseTwinGirlComponent> = (args) => {
  return <NightPhaseTwinGirlComponent {...args} />;
};

export const Solo = Template.bind({});
Solo.args = {
  twinBoyPlayer: undefined,
};

export const HasTwin = Template.bind({});
HasTwin.args = {
  twinBoyPlayer: 'Teddy',
};
