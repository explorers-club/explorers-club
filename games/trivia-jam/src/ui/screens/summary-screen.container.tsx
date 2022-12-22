import { useStoreSelector } from '../../state/trivia-jam.hooks';
import { SummaryScreenComponent } from './summary-screen.component';

export const SummaryScreen = () => {
  const players = useStoreSelector((state) => Object.values(state.players));

  return <SummaryScreenComponent players={players} />;
};
