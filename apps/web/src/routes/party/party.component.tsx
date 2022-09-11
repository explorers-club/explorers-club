import styled from 'styled-components';

export function PartyComponent() {
  return (
    <Container>
      <p>Player List</p>

      <form>
        <label htmlFor="name">Player name:</label>
        <input type="text" placeholder="Enter name" name="name" />
      </form>
    </Container>
  );
}

const Container = styled.div``;
