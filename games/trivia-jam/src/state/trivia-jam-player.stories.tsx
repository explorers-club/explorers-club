import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import { createTriviaJamPlayerMachine } from './trivia-jam-player.machine';

export const MachinePreview = () => {
  const machine = createTriviaJamPlayerMachine().withContext({
    playerName: 'Teddy',
  });
  return <RenderMachine machine={machine} />;
};

export default {
  title: "State/Trivia Jam Player"
}