import { ProfileTab } from './profile-tab.container';

export default {
  component: ProfileTab,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Default = () => {
  return <ProfileTab />;
};
