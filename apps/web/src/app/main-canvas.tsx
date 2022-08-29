import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import LobbyScene from '../scenes/lobby/lobby';

export function MainCanvas() {
  return (
    <Container>
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [0, 0, 50] }}
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
