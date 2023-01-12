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

export const Monk = Template.bind({});
Monk.args = {
  role: 'monk',
};

export const Student = Template.bind({});
Student.args = {
  role: 'student',
};

export const Anarchist = Template.bind({});
Anarchist.args = {
  role: 'anarchist',
};

export const Conspirator = Template.bind({});
Conspirator.args = {
  role: 'conspirator',
};

export const Politician = Template.bind({});
Politician.args = {
  role: 'politician',
};
