import { useSelectActors } from '@explorers-club/actor';
import { useCallback, useContext } from 'react';
import { AnyActorRef } from 'xstate';
import { PartyScreenContext } from './party-screen.context';

export const Lobby = () => {
  const actorManager = useContext(PartyScreenContext);
  const playerActors = useSelectActors(actorManager, {
    actorType: 'PLAYER_ACTOR',
  });

  const handlePressJoin = useCallback(() => {
    console.log('joiN!');
    // partyConnectionActor.send(PartyConnectionEvents.CONNECT())
  }, []);

  return (
    <div>
      <h3>Lobby</h3>
      <ul>
        {playerActors.map((actor: AnyActorRef) => (
          <li key={actor.id}>{actor.id}</li>
        ))}
      </ul>
      <button onClick={handlePressJoin}>Join Party</button>
    </div>
  );
};
