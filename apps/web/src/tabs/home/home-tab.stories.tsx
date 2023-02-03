import { HomeTab } from './home-tab.container';

export default {
  component: HomeTab,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Default = () => {
  return <HomeTab />;
};
