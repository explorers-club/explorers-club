import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseTwinBoyComponent } from './night-phase-twin-boy.component';

export default { component: NightPhaseTwinBoyComponent,
  decorators: [withCardDecorator]
 } as Meta;

const Template: ComponentStory<typeof NightPhaseTwinBoyComponent> = (
  args
) => {
  return <NightPhaseTwinBoyComponent {...args} />;
};

export const Solo = Template.bind({});
Solo.args = {
  twinGirlPlayer: undefined,
};

export const HasTwin = Template.bind({});
HasTwin.args = {
  twinGirlPlayer: 'Fern',
};
