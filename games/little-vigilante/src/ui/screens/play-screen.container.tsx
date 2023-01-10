import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { DiscussionPhaseScreen } from './discussion-phase.container';
import { NightPhaseScreen } from './night-phase-screen.container';
import { RevealScreen } from './reveal-screen.container';
import { ScoreboardScreen } from './scoreboard-screen.constainer';
import { VotingPhaseScreen } from './voting-phase-screen.container';

export const PlayScreen = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);
  console.log(states);

  switch (true) {
    case states.includes('Playing.AwaitingNext'):
      return <ScoreboardScreen />;
    case states.includes('Playing.Round.NightPhase'):
      return <NightPhaseScreen />;
    case states.includes('Playing.Round.DiscussionPhase'):
      return <DiscussionPhaseScreen />;
    case states.includes('Playing.Round.Voting'):
      return <VotingPhaseScreen />;
    case states.includes('Playing.Round.Reveal'):
      return <RevealScreen />;
    default:
      return null;
  }
};
