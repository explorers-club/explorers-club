import { Box } from '../atoms/Box';
import { DecoratorFn } from '@storybook/react';
import { darkTheme, theme as lightTheme } from '../stitches.config';

export const withTheme: DecoratorFn = (StoryFn, context) => {
  const theme = context.parameters['theme'] || context.globals['theme'];
  const storyTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Box className={storyTheme}>
      <StoryFn />
    </Box>
  );
};

export const themeGlobalType = {
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
};
