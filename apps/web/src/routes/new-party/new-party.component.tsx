import styled from 'styled-components';

export function NewPartyComponent() {
  return (
    <Container>
      <p>New Party</p>
      <form>
        <label htmlFor="name">Your name:</label>
        <input type="text" placeholder="Enter name" name="name" />
      </form>
    </Container>
  );
}

const Container = styled.div``;
