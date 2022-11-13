import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { Caption } from '@explorers-club/components/atoms/Caption';
import { Card } from '@explorers-club/components/atoms/Card';
import { Flex } from '@explorers-club/components/atoms/Flex';
import { ConnectedContext } from '../../state/connected.context';
import {
  PlayerListItem,
  PlayerListItemPlaceholder,
} from './player-list-item.component';

export const PlayerList = () => {
  const { actorManager, partyActor } = useContext(ConnectedContext);
  const playerActors = useSelector(partyActor, (state) => {
    return state.context.playerActorIds
      .map((actorId) => actorManager.getActor(actorId))
      .filter((actor) => {
        return actor;
      }) as PartyPlayerActor[];
  });

  return (
    <Card css={{ p: '$3' }}>
      <Caption css={{ color: '$gray11', textTransform: 'uppercase', mb: '$2' }}>
        Connected players
      </Caption>
      <Flex css={{ gap: '$2', fd: 'column' }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const actor = playerActors[i];
          if (actor) {
            return <PlayerListItem key={actor.id} actor={actor} />;
          } else {
            return <PlayerListItemPlaceholder key={i} />;
          }
        })}
      </Flex>
    </Card>
  );
};
