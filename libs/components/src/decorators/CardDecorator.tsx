import { Args, DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';

// Not sure why abs import working
import { Card } from '../atoms/Card';

export const withCardDecorator: DecoratorFunction<ReactFramework, Args> = (
  Story
) => {
  return (
    <Card>
      <Story />
    </Card>
  );
};
