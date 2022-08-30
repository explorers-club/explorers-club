import { Lobby } from '../ui/lobby';
import styled from 'styled-components';

export function MainUI() {
  // TODO
  // expose the height of the main container
  // through a hook like useCamera
  // so children can take control of it
  return (
    <Container>
      <Lobby />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 200px;
  background: white;
  z-index: 1;
`;

export default MainUI;
