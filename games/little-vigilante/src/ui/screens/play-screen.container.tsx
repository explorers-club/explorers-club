import { useEffect, useRef } from 'react';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { AssigningRolesScreen } from './assigning-roles-screen.container';
import { DiscussionPhaseScreen } from './discussion-phase-screen.container';
import { NightPhaseScreen } from './night-phase-screen.container';
import { RevealScreen } from './reveal-screen.container';
import { ScoreboardScreen } from './scoreboard-screen.constainer';
import { VotingPhaseScreen } from './voting-phase-screen.container';

export const PlayScreen = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);
  useMusic();

  switch (true) {
    case states.includes('Playing.AwaitingNext'):
      return <ScoreboardScreen />;
    case states.includes('Playing.Round.AssigningRoles'):
      return <AssigningRolesScreen />;
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

const useMusic = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);
  const currentTrackNameRef = useRef<string>('');
  const currentAudioRef = useRef<HTMLAudioElement | null>();

  useEffect(() => {
    let toPlay = 'night';
    if (states.includes('Playing.Round.DiscussionPhase')) {
      toPlay = 'morning';
    } else if (
      states.includes('Playing.Round.NightPhase') ||
      states.includes('Playing.Round.AssigningRoles') ||
      states.includes('Playing.Round.Voting') ||
      states.includes('Playing.Round.Reveal')
    ) {
      toPlay = 'night';
    } else {
      toPlay = '';
    }

    if (toPlay === '') {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      currentTrackNameRef.current = '';
    } else if (currentTrackNameRef.current !== toPlay) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }

      currentAudioRef.current = new Audio(
        `/assets/little-vigilante/audio/${toPlay}.mp3`
      );
      currentAudioRef.current.play();
      currentTrackNameRef.current = toPlay;
    }
  });
};
