import {
  withTheme,
  themeGlobalType,
} from '../../../libs/components/src/decorators/ThemeDecorator';

export const decorators = [withTheme];

export const globalTypes = {
  theme: themeGlobalType,
};
