import { ActorManager } from '@explorers-club/actor';
import { FC, useEffect } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { GameContext } from '../state/game.context';
import { contentfulClient } from '@explorers-club/contentful';

interface Props {
  actorManager: ActorManager;
}

export const TriviaJamMainUI: FC<Props> = ({ actorManager }) => {
  useEffect(() => {
    contentfulClient.getEntry('6THg9TlFzbKerSDrniPxL0').then((f) => {
      console.log({ f });
    });
  }, []);

  return (
    <GameContext.Provider value={{ actorManager }}>
      <div>
        <h2>Welcome to Trivia Jam!</h2>
        <Leaderboard />
      </div>
    </GameContext.Provider>
  );
};
