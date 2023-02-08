import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { withLittleVigilanteContext } from '../../test/withLittleVigilanteContext';
import { Chat } from './chat.component';

export default {
  component: Chat,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    cardCSS: {
      p: '$0',
    },
  },
};

export const Default = () => {
  return <Chat />;
};
