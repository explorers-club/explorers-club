import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { ComponentStory } from '@storybook/react';
import { RoleAssignmentComponent } from './role-assignment.component';

export default {
  component: RoleAssignmentComponent,
  decorators: [withCardDecorator],
  parameters: {
    layout: 'fullscreen',
    cardCSS: {
      p: '$0',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

const Template: ComponentStory<typeof RoleAssignmentComponent> = (args) => {
  return <RoleAssignmentComponent {...args} />;
};

export const Butler = Template.bind({});

Butler.args = {
  myRole: 'butler',
  roles: [
    'vigilante',
    'butler',
    'anarchist',
    'snitch',
    'detective',
    'monk',
    'con_artist',
  ],
};

export const Anarchist = Template.bind({});

Anarchist.args = {
  myRole: 'anarchist',
  roles: [
    'vigilante',
    'butler',
    'anarchist',
    'snitch',
    'detective',
    'monk',
    'con_artist',
  ],
};

export const TwinGirl = Template.bind({});

TwinGirl.args = {
  myRole: 'twin_girl',
  roles: [
    'vigilante',
    'sidekick',
    'butler',
    'twin_girl',
    'twin_boy',
    'snitch',
    'detective',
    'monk',
    'con_artist',
  ],
};

export const Sidekick = Template.bind({});

Sidekick.args = {
  myRole: 'sidekick',
  roles: [
    'vigilante',
    'sidekick',
    'butler',
    'twin_girl',
    'twin_boy',
    'snitch',
    'mayor',
    'detective',
    'monk',
    'con_artist',
  ],
};
