import { LittleVigilanteStory } from '../../test/withLittleVigilanteContext';
import { RevealScreenComponent } from './reveal-screen.component';

export default {
  component: RevealScreenComponent,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// const Template: LittleVigilanteStory = (args) => {
//   return <RevealScreenComponent />;
// };

// export const CitizensLose = Template.bind({});

// CitizensLose.args = {
//   myWinState: false,
//   playerOutcomes: [
//     {
//       playerName: 'Alice',
//       role: 'vigilante',
//       winner: true,
//       userId: 'alice123',
//       slotNumber: 1,
//     },
//     {
//       playerName: 'Bob',
//       role: 'butler',
//       winner: true,
//       userId: 'bob123',
//       slotNumber: 2,
//     },
//     {
//       playerName: 'Charlie',
//       role: 'cop',
//       winner: false,
//       userId: 'charlie123',
//       slotNumber: 3,
//     },
//     {
//       playerName: 'Dave',
//       role: 'mayor',
//       winner: false,
//       userId: 'dave123',
//       slotNumber: 4,
//     },
//   ],
// };

// export const CitizensWin = Template.bind({});

// CitizensWin.args = {
//   myWinState: true,
//   playerOutcomes: [
//     {
//       playerName: 'Alice',
//       role: 'vigilante',
//       winner: false,
//       userId: 'alice123',
//       slotNumber: 1,
//     },
//     {
//       playerName: 'Bob',
//       role: 'butler',
//       winner: false,
//       userId: 'bob123',
//       slotNumber: 2,
//     },
//     {
//       playerName: 'Charlie',
//       role: 'cop',
//       winner: true,
//       userId: 'charlie123',
//       slotNumber: 3,
//     },
//     {
//       playerName: 'Dave',
//       role: 'mayor',
//       winner: true,
//       userId: 'dave123',
//       slotNumber: 4,
//     },
//     {
//       playerName: 'Eve',
//       role: 'twin_girl',
//       winner: true,
//       userId: 'eve123',
//       slotNumber: 5,
//     },
//     {
//       playerName: 'Frank',
//       role: 'twin_boy',
//       winner: true,
//       userId: 'frank123',
//       slotNumber: 6,
//     },
//     {
//       playerName: 'Gina',
//       role: 'monk',
//       winner: true,
//       userId: 'gina123',
//       slotNumber: 7,
//     },
//     {
//       playerName: 'Herb',
//       role: 'anarchist',
//       winner: false,
//       userId: 'herb123',
//       slotNumber: 8,
//     },
//   ],
// };
