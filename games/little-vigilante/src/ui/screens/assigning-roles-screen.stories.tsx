import { ComponentStory } from '@storybook/react';
import { AssigningRolesScreenComponent } from './assigning-roles-screen.component';

export default {
  component: AssigningRolesScreenComponent,
};

const Template: ComponentStory<typeof AssigningRolesScreenComponent> = (
  args
) => {
  return <AssigningRolesScreenComponent {...args} />;
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
