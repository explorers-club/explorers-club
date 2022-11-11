import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Box } from './components/atoms/Box';
import { Scenes } from './scenes';
import { GlobalStateContext } from './state/global.provider';

export function MainCanvas() {
  const ContextBridge = useContextBridge(GlobalStateContext);

  return (
    <Box>
      {/* Configuration: https://github.com/pmndrs/leva/blob/main/docs/configuration.md */}
      <Leva hidden flat collapsed />
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [20, 10, 20] }}
      >
        <ContextBridge>
          <Scenes />
        </ContextBridge>
      </Canvas>
    </Box>
  );
}

export default MainCanvas;
