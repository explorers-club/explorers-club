/* eslint-disable jsx-a11y/aria-role */
import { Card } from '@atoms/Card';
import { RoleCarousel } from '../organisms/role-carousel.component';

export const NightPhaseScreenComponent = () => {
  // const states = useLittleVigilanteSelector((state) => state.currentStates);
  // const myUserId = useMyUserId();
  // const currentRole = useLittleVigilanteSelector(
  //   (state) => state.currentRoundRoles[myUserId]
  // );
  // const [initialRole] = useState(currentRole);
  // const arresteduserId = useLittleVigilanteSelector(
  //   (state) => state.currentRoundArrestedPlayerId
  // );

  return (
    <Card>
      <RoleCarousel />
    </Card>
  );
  // const Component = getComponent(states, initialRole);

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
