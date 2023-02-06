import { LittleVigilanteScoreboardCard } from './little-vigilante-scoreboard-card.component';

export default {
  component: LittleVigilanteScoreboardCard,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Default = () => <LittleVigilanteScoreboardCard />;
