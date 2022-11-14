import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { ActorManager } from '@explorers-club/actor';
import { PartyActor, PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import {
  PlayerListItem,
  PlayerListItemPlaceholder,
} from './player-list-item.component';

const DEFAULT_LOBBY_DISPLAY_SIZE = 4;

interface Props {
  partyActor: PartyActor;
  actorManager: ActorManager;
}

export const PlayerListComponent: FC<Props> = ({
  partyActor,
  actorManager,
}) => {
  const playerActors = useSelector(partyActor, (state) => {
    return state.context.playerActorIds
      .map((actorId) => actorManager.getActor(actorId))
      .filter((actor) => {
        return actor;
      }) as PartyPlayerActor[];
  });

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Caption
          css={{ color: '$gray11', textTransform: 'uppercase', mb: '$2' }}
        >
          Party
        </Caption>
        <Flex css={{ mt: '$6', gap: '$4', fd: 'column' }}>
          {Array.from({ length: DEFAULT_LOBBY_DISPLAY_SIZE }).map((_, i) => {
            const actor = playerActors[i];
            if (actor) {
              return <PlayerListItem key={actor.id} actor={actor} partyActor={partyActor} />;
            } else {
              return <PlayerListItemPlaceholder key={i} />;
            }
          })}
        </Flex>
      </Card>
    </Box>
  );
};
