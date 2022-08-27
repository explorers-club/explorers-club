import styled from 'styled-components';

export function MainUI() {
  return <Container>Hello, Worl UI</Container>;
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export default MainUI;
