import {
  themeGlobalType,
  withTheme,
} from '../../../libs/components/src/decorators/ThemeDecorator';

export const globalTypes = {
  theme: themeGlobalType,
};

// export all decorators that should be globally applied in an array
export const decorators = [withTheme];
