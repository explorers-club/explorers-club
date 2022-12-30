import { Box } from './Box';

import { Image } from './Image';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Image,
} as ComponentMeta<typeof Image>;

export const Default: ComponentStory<typeof Image> = (props) => (
  <Box>
    <Image src="https://images.unsplash.com/photo-1453235421161-e41b42ebba05?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2550&q=80" />
  </Box>
);
