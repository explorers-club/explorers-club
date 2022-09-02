import { useRef, useCallback, FormEvent } from 'react';
import styled from 'styled-components';

interface Props {
  onSubmit: (name: string) => void;
}

export function PlayerSetupComponent({ onSubmit }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const name = nameRef.current?.value;
      if (name) {
        onSubmit(name);
      } else {
        // TODO validate form, show error
      }

      e.preventDefault();
    },
    [nameRef, onSubmit]
  );

  return (
    <Container>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="name">Choose a player name</label>
        <input
          ref={nameRef}
          type="text"
          name="name"
          placeholder="(e.g. InspectorT)"
        />
        <input type="submit" value="Submit" />
      </form>
    </Container>
  );
}

const Container = styled.div``;
