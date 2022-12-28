// Theme setup from: https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
import { DecoratorFn } from '@storybook/react';
import React from 'react';
import './global.css';
import { Box } from '../src/atoms/Box';

// import { GlobalStyle } from '../src/styles/GlobalStyle';
import { theme as lightTheme, darkTheme } from '../src/stitches.config';

const withTheme: DecoratorFn = (StoryFn, context) => {
  const theme = context.parameters.theme || context.globals.theme;
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

// export const parameters = {
//   viewport: {
//     defaultViewport: 'mobile1',
//   },
// };
