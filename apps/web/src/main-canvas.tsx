import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import styled from 'styled-components';
import LobbyScene from './scenes/lobby/lobby.scene';

export function MainCanvas() {
  return (
    <Container>
      {/* Configuration: https://github.com/pmndrs/leva/blob/main/docs/configuration.md */}
      <Leva flat collapsed />
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [20, 10, 20] }}
      >
        <LobbyScene />
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
