/* eslint-disable jsx-a11y/aria-role */
import { ReactNode, useState } from 'react';
import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { NightPhaseScreenComponent } from './night-phase-screen.component';
// import { NightPhaseArrestedScreen } from './night-phase-arrested-screen.container';
// import { NightPhaseButlerScreen } from './night-phase-butler-screen.container';
// import { NightPhaseConspiratorScreen } from './night-phase-conspirator-screen.container';
// import { NightPhaseCopScreen } from './night-phase-cop-screen.container';
// import { NightPhaseDetectiveScreen } from './night-phase-detective-screen.container';
// import { NightPhaseMonkScreen } from './night-phase-monk-screen.container';
// import { NightPhasePoliticianScreen } from './night-phase-politician-screen.container';
// import { NightPhaseSidekickScreen } from './night-phase-sidekick-screen.container';
// import { NightPhaseStudentScreen } from './night-phase-student-screen.container';
// import { NightPhaseVigilanteScreen } from './night-phase-vigilante-screen.container';

export const NightPhaseScreen = () => {
  return <NightPhaseScreenComponent />;
  // const states = useLittleVigilanteSelector((state) => state.currentStates);
  // const myUserId = useMyUserId();
  // const currentRole = useLittleVigilanteSelector(
  //   (state) => state.currentRoundRoles[myUserId]
  // );
  // const [initialRole] = useState(currentRole);
  // const arresteduserId = useLittleVigilanteSelector(
  //   (state) => state.currentRoundArrestedPlayerId
  // );
  // const Component = getComponent(states, initialRole);
  // return null;

  // if (!Component) {
  //   return null;
  // }

  // const isArrested = myUserId === arresteduserId;
  // return !isArrested ? Component : <NightPhaseArrestedScreen />;
};

// const getComponent = (states: string[], myRole: string) => {
//   switch (true) {
//     case states.includes('Playing.Round.NightPhase.Cop') && myRole === 'cop':
//       return <NightPhaseCopScreen />;
//     case states.includes('Playing.Round.NightPhase.Vigilante') &&
//       myRole === 'vigilante':
//       return <NightPhaseVigilanteScreen />;
//     case states.includes('Playing.Round.NightPhase.Student') &&
//       myRole === 'student':
//       return <NightPhaseStudentScreen />;
//     case states.includes('Playing.Round.NightPhase.Butler') &&
//       myRole === 'butler':
//       return <NightPhaseButlerScreen />;
//     case states.includes('Playing.Round.NightPhase.Detective') &&
//       myRole === 'detective':
//       return <NightPhaseDetectiveScreen />;
//     case states.includes('Playing.Round.NightPhase.Conspirator') &&
//       myRole === 'conspirator':
//       return <NightPhaseConspiratorScreen />;
//     case states.includes('Playing.Round.NightPhase.Politician') &&
//       myRole === 'politician':
//       return <NightPhasePoliticianScreen />;
//     case states.includes('Playing.Round.NightPhase.Sidekick') &&
//       myRole === 'sidekick':
//       return <NightPhaseSidekickScreen />;
//     case states.includes('Playing.Round.NightPhase.Monk') && myRole === 'monk':
//       return <NightPhaseMonkScreen />;
//     default:
//       return null;
//   }
// };
