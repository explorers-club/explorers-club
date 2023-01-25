import React, { useCallback } from 'react';
import {
  useCodebreakersSelector,
  useCodebreakersSend,
  useIsHost,
  useMyUserId,
} from '../../state/codebreakers.hooks';
import { ChooseTeamsScreenComponent } from './choose-teams-screen.component';

export const ChooseTeamsScreen = () => {
  const players = useCodebreakersSelector((state) =>
    Object.values(state.players)
  );
  const myUserId = useMyUserId();
  const isHost = useIsHost();
  const send = useCodebreakersSend();

  const handlePressJoinTeam = useCallback(
    (team: string) => {
      send({ type: 'JOIN_TEAM', team });
    },
    [send]
  );

  const handlePressStartGame = useCallback(() => {
    send({ type: 'CONTINUE' });
  }, [send]);

  const handlePressBecomeClueGiver = useCallback(() => {
    send({ type: 'BECOME_CLUE_GIVER' });
  }, [send]);

  return (
    <ChooseTeamsScreenComponent
      players={players}
      myUserId={myUserId}
      onPressJoinTeam={handlePressJoinTeam}
      onPressBecomeClueGiver={handlePressBecomeClueGiver}
      onPressStartGame={handlePressStartGame}
      isHost={isHost}
    />
  );
};
