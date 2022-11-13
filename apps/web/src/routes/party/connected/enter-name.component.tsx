import { Box } from '@explorers-club/components/atoms/Box';
import { useCallback, FormEvent, useRef } from 'react';
import { usePartyScreenActor } from '../party-screen.hooks';
import { PartyScreenEvents } from '../party-screen.machine';

export const EnterName = () => {
  const actor = usePartyScreenActor();
  const playerNameRef = useRef<HTMLInputElement>(null);

  const handleChangePlayerName = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      actor.send(
        PartyScreenEvents.INPUT_CHANGE_PLAYER_NAME(
          playerNameRef.current?.value || ''
        )
      );
    },
    [playerNameRef, actor]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      actor.send(PartyScreenEvents.PRESS_SUBMIT());
      e.preventDefault();
      return false;
    },
    [actor]
  );

  return (
    <Box>
      <h2>Choose a name</h2>
      <form onSubmit={handleSubmit}>
        {/* {errorMessage !== '' && (
          <ErrorMessage>
            <strong>{errorMessage}</strong>
          </ErrorMessage>
        )} */}
        <input
          ref={playerNameRef}
          type="text"
          name="playerName"
          onChange={handleChangePlayerName}
        />
        <input type="submit" value="Join" />
      </form>
    </Box>
  );
};
