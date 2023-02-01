import { ReservedUpgradeCard } from './ReservedUpgradeCard';

export default {
  component: ReservedUpgradeCard,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Default = () => {
  return <ReservedUpgradeCard playerName="Jambalaya22" />;
};
