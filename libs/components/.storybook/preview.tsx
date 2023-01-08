// Theme setup from: https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
import './global.css';
import { themeGlobalType, withTheme } from '../src/decorators/ThemeDecorator';

export const globalTypes = {
  theme: themeGlobalType,
};

// export all decorators that should be globally applied in an array
export const decorators = [withTheme];

export const parameters = {
  layout: 'fullscreen',
};
