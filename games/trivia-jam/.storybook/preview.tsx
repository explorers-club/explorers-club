import React from 'react';
import { Box } from '../../../libs/components/src/atoms/Box';
import {
  darkTheme,
  theme as lightTheme,
} from '../../../libs/components/src/stitches.config';
import { DecoratorFn } from '@storybook/react';

const withTheme: DecoratorFn = (StoryFn, context) => {
  const theme = context.parameters['theme'] || context.globals['theme'];
  const storyTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Box className={storyTheme}>
      <StoryFn />
    </Box>
  );
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

// export all decorators that should be globally applied in an array
export const decorators = [withTheme];
