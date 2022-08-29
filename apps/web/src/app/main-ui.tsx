import styled from 'styled-components';

export function MainUI() {
  return <Container>Hello, Worl UI</Container>;
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120px;
  background: white;
  z-index: 1;
`;

export default MainUI;
