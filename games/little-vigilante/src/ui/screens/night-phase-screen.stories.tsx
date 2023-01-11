import { ComponentStory } from '@storybook/react';
import { NightPhaseScreenComponent } from './night-phase-screen.component';

export default {
  component: NightPhaseScreenComponent,
};

const Template: ComponentStory<typeof NightPhaseScreenComponent> = (args) => {
  return <NightPhaseScreenComponent {...args} />;
};

export const Vigilante = Template.bind({});
Vigilante.args = {
  role: 'vigilante',
};

export const Butler = Template.bind({});
Butler.args = {
  role: 'butler',
};

export const Cop = Template.bind({});
Cop.args = {
  role: 'cop',
};

export const Detective = Template.bind({});
Detective.args = {
  role: 'detective',
};

export const Mayor = Template.bind({});
Mayor.args = {
  role: 'mayor',
};

export const Sidekick = Template.bind({});
Sidekick.args = {
  role: 'sidekick',
};

export const Jester = Template.bind({});
Jester.args = {
  role: 'jester',
};
