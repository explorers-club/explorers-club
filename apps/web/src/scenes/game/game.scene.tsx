// For now just always use treehouse trivia, eventually this is dynamic as we switch between games
import { MainScene } from '@explorers-club/trivia-jam/scene';

export function GameScene() {
  // Get the game actor, and render the appropriate scene

  // const color = useMemo(() => new Color('#FFCBBE').convertSRGBToLinear(), []);
  // const envMap = useLoader(RGBELoader, "./assets/envmap.hdr");

  return <MainScene />;
}

export default GameScene;
