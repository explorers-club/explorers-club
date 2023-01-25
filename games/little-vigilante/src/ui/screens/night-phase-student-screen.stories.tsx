import { ComponentStory, Meta } from '@storybook/react';
import { NightPhaseStudentScreenComponent } from './night-phase-student-screen.component';

export default { component: NightPhaseStudentScreenComponent } as Meta;

const Template: ComponentStory<
  typeof NightPhaseStudentScreenComponent
> = (args) => {
  return <NightPhaseStudentScreenComponent {...args} />;
};

export const Solo = Template.bind({});
Solo.args = {
  otherStudents: [],
};

export const Others = Template.bind({});
Others.args = {
  otherStudents: ['Jambalaya22', 'Teddy'],
};
