// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, Story } from '@storybook/react';
import 'react-spring-bottom-sheet/dist/style.css';
import { GameEndScreenComponent } from './game-end-screen.component';

const meta = {
  component: GameEndScreenComponent,
  parameters: {
    profiles: {
      values: [{ name: 'default', value: { userId: 'foo', name: 'bar' } }],
    },
  },
} as ComponentMeta<typeof GameEndScreenComponent>;

const Template: Story = () => {
  return <GameEndScreenComponent />;
};

export const Default = Template.bind({});

export default meta;
