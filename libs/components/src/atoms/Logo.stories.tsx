import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Image } from './Image';
import { Logo } from './Logo';

export default {
  component: Image,
} as ComponentMeta<typeof Image>;

export const Default: ComponentStory<typeof Image> = (props) => <Logo />;
