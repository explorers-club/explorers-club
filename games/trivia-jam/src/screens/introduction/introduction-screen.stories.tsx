// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { IntroductionScreenComponent } from './introduction-screen.component';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

const meta = {
  component: IntroductionScreenComponent,
  argTypes: {
    onIntroComplete: { action: 'intro complete' },
    onPressCta: { action: 'press cta' },
  },
  decorators: [
    (Story, props) => {
      return (
        <BottomSheet
          open={true}
          blocking={false}
          defaultSnap={DEFAULT_SNAP}
          snapPoints={DEFAULT_SNAP_POINTS}
          expandOnContentDrag={true}
        >
          <Story />
        </BottomSheet>
      );
    },
  ],
} as ComponentMeta<typeof IntroductionScreenComponent>;

const Template: ComponentStory<typeof IntroductionScreenComponent> = (args) => {
  return <IntroductionScreenComponent {...args} />;
};

export const WithButton = Template.bind({});

WithButton.args = {
  playerName: 'InspectorT',
  ctaLabel: 'Continue',
};

export default meta;
