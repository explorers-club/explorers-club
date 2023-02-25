import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { FC, useEffect, useLayoutEffect } from 'react';
import { Heading } from '@atoms/Heading';
import { useLittleVigilanteSelector } from '../../../state/little-vigilante.hooks';
import {
  LittleVigilanteStory,
  withLittleVigilanteContext,
} from '../../../test/withLittleVigilanteContext';
import {
  PlayerBoard,
  PlayerBoardItemAvatar,
  PlayerBoardItemCard,
  PlayerBoardItemName,
  PlayerBoardItemRoot,
} from './player-board.component';
import { PlayerBoardActor, usePlayerBoard } from './player-board.hooks';
import { Box } from '../../../../../../libs/components/src/atoms';
import { colorBySlotNumber } from '../../../../../../libs/components/src/stitches.config';

const players = {
  alice123: {
    name: 'Alice',
    score: 0,
    userId: 'alice123',
    connected: true,
    slotNumber: 1,
    currentRoundRoleTargets: {
      bob123: 'snitch',
      eve123: 'con_artist',
    },
  },
  bob123: {
    name: 'Bob',
    score: 0,
    userId: 'bob123',
    connected: true,
    slotNumber: 2,
    currentRoundRoleTargets: {},
  },
  charlie123: {
    name: 'Charlie',
    userId: 'charlie123',
    score: 0,
    connected: true,
    slotNumber: 3,
    currentRoundRoleTargets: {
      dave123: 'vigilante',
      bob123: 'snitch',
    },
  },
  dave123: {
    name: 'Dave',
    userId: 'dave123',
    score: 0,
    connected: true,
    slotNumber: 4,
    currentRoundRoleTargets: {
      alice123: 'twin_girl',
      bob123: 'con_artist',
    },
  },
  eve123: {
    name: 'Eve',
    userId: 'eve123',
    score: 0,
    connected: true,
    slotNumber: 5,
    currentRoundRoleTargets: {
      dave123: 'vigilante',
      bob123: 'con_artist',
    },
  },
  frank123: {
    name: 'Frank',
    userId: 'frank123',
    score: 0,
    connected: true,
    slotNumber: 6,
    currentRoundRoleTargets: {
      bob123: 'monk',
    },
  },
  gina123: {
    name: 'Gina',
    userId: 'gina123',
    score: 0,
    connected: true,
    slotNumber: 7,
    currentRoundRoleTargets: {
      bob123: 'monk',
    },
  },
  herb123: {
    name: 'Herb',
    userId: 'herb123',
    score: 0,
    connected: true,
    slotNumber: 8,
    currentRoundRoleTargets: {
      bob123: 'monk',
    },
  },
};

export default {
  component: PlayerBoard,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    cardCSS: {
      p: '0',
    },
  },
};

const Template: FC<{ actor: PlayerBoardActor }> = ({ actor }) => {
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );
  return (
    <PlayerBoard actor={actor}>
      {players.map(({ userId, name, slotNumber }) => {
        const color = colorBySlotNumber[slotNumber];

        return (
          <PlayerBoardItemRoot value={userId}>
            <PlayerBoardItemCard
              css={{
                position: 'relative',
                p: '$1',
              }}
            >
              <Box
                css={{
                  p: '$2',
                  background: `$${color}8`,
                  borderRadius: '$2',
                }}
              >
                <PlayerBoardItemName />
                <Box css={{ position: 'absolute', right: 0, bottom: '-35%' }}>
                  <PlayerBoardItemAvatar size={'5'} />
                </Box>
              </Box>
            </PlayerBoardItemCard>
          </PlayerBoardItemRoot>
        );
      })}
    </PlayerBoard>
  );
};

export const Disabled: LittleVigilanteStory = () => {
  const actor = usePlayerBoard();
  return <Template actor={actor} />;
};

Disabled.args = {
  myUserId: 'alice123',
  state: {
    players,
  },
};

export const AllButMeActive: LittleVigilanteStory = () => {
  const actor = usePlayerBoard();
  const allButMe = Object.keys(players).filter((id) => id !== 'alice123');

  useLayoutEffect(() => {
    actor.send({
      type: 'ACTIVATE',
      keys: allButMe,
    });
  });

  return <Template actor={actor} />;
};

AllButMeActive.args = {
  myUserId: 'alice123',
  state: {
    players,
  },
};

// export const AllButMeActive: LittleVigilanteStory = () => {
//   const actor = usePlayerBoard();
//   const allButMe = Object.keys(players).filter((id) => id !== 'alice123');

//   useLayoutEffect(() => {
//     actor.send({
//       type: 'ACTIVATE',
//       keys: allButMe,
//     });
//   });

//   return <Template actor={actor} />;
// };

// AllButMeActive.args = {
//   myUserId: 'alice123',
//   state: {
//     players,
//   },
// };

export const OneSelected: LittleVigilanteStory = () => {
  const actor = usePlayerBoard();
  const allButMe = Object.keys(players).filter((id) => id !== 'alice123');

  useLayoutEffect(() => {
    actor.send({
      type: 'ACTIVATE',
      keys: allButMe,
    });
    actor.send({
      type: 'PRESS',
      key: 'dave123',
    });
  });

  return <Template actor={actor} />;
};

OneSelected.args = {
  myUserId: 'alice123',
  state: {
    players,
  },
};

export const OneRevealed: LittleVigilanteStory = () => {
  const actor = usePlayerBoard();
  const allButMe = Object.keys(players).filter((id) => id !== 'alice123');

  useLayoutEffect(() => {
    actor.send({
      type: 'REVEAL',
      key: 'dave123',
      role: 'vigilante',
    });
  });

  useEffect(() => {
    setTimeout(() => {
      actor.send({
        type: 'UNREVEAL',
        key: 'dave123',
        deactivate: false,
      });
    }, 2000);
  }, [actor]);

  return <Template actor={actor} />;
};

OneRevealed.args = {
  myUserId: 'alice123',
  state: {
    players,
  },
};

// export const OnlyMeActive: LittleVigilanteStory = () => {
//   const playerBoardRef = usePlayerBoard();
//   return <PlayerBoard ref={playerBoardRef} />;
// };

// OnlyMeActive.args = {
//   myUserId: 'alice123',
//   state: {
//     players,
//   },
// };

// export const AllButMeActive: LittleVigilanteStory = () => {
//   const playerBoardRef = usePlayerBoard();
//   const allButMe = Object.keys(players).filter((id) => id !== 'alice123');
//   return <PlayerBoard ref={playerBoardRef} />;
// };

// AllButMeActive.args = {
//   myUserId: 'alice123',
//   state: {
//     players,
//   },
// };

// export const DropDownMenu: LittleVigilanteStory = () => {
//   // const allButMe = Object.keys(players).filter((id) => id !== 'alice123');

//   // const PlayerMenu: FC<{ userId: string }> = ({ userId }) => {
//   //   const players = useLittleVigilanteSelector((state) => state.players);
//   //   return <Heading>Hi{players[userId].name}</Heading>;
//   // };

//   // return <PlayerBoard activePlayers={allButMe} renderPlayerMenu={PlayerMenu} />;
//   const playerBoardRef = usePlayerBoard();
//   const allButMe = Object.keys(players).filter((id) => id !== 'alice123');
//   return <PlayerBoard ref={playerBoardRef} />;
// };

// DropDownMenu.args = {
//   myUserId: 'alice123',
//   state: {
//     players,
//   },
// };
