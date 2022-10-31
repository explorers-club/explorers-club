import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import styled from 'styled-components';
import { Scenes } from './scenes';
import { GlobalStateContext } from './state/global.provider';

export function MainCanvas() {
  const ContextBridge = useContextBridge(GlobalStateContext);

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default MainCanvas;
