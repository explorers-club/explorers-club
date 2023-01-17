import {
  CodebreakersCommand,
  CodebreakersStateSerialized,
} from '@explorers-club/room';
import { CodebreakerBoardItem } from '@explorers-club/schema-types/CodebreakerBoardItem';
import { CodebreakersState } from '@explorers-club/schema-types/CodebreakersState';
import { assertEventType } from '@explorers-club/utils';
import { A, pipe } from '@mobily/ts-belt';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';
import { selectWinningTeam } from '../state/codebreakers.selectors';

export interface CodebreakersServerContext {
  room: Room<CodebreakersState>;
}

export type CodebreakersServerEvent = CodebreakersCommand & {
  userId: string;
};

export const createCodebreakersServerMachine = (
  room: Room<CodebreakersState>
) => {
  return createMachine(
    {
      id: 'CodebreakersServerMachine',
      initial: 'Initializing',
      context: {
        room,
      },
      schema: {
        context: {} as CodebreakersServerContext,
        events: {} as CodebreakersServerEvent,
      },
      states: {
        Initializing: {
          always: [
            {
              target: 'Playing',
              cond: 'allPlayersConnected',
            },
            {
              target: 'Waiting',
            },
          ],
        },
        Waiting: {
          on: {
            JOIN: {
              target: 'ChooseTeams',
              cond: 'allPlayersConnected',
            },
          },
        },
        ChooseTeams: {
          on: {
            JOIN_TEAM: {
              actions: 'assignPlayerTeam',
            },
            BECOME_CLUE_GIVER: {
              actions: 'assignClueGiver',
            },
            CONTINUE: {
              target: 'Playing',
            },
          },
        },
        Playing: {
          entry: 'setupGame',
          initial: 'GivingClue',
          onDone: 'GameOver',
          states: {
            GivingClue: {
              entry: 'setTeam',
              on: {
                CLUE: {
                  target: 'Guessing',
                  actions: ({ room }, event) => {
                    // todo add + 1 if we missed last time
                    room.state.guessesRemaining = event.numWords;
                    room.state.currentClueCount = event.numWords;
                    room.state.currentClue = event.clue;
                  },
                },
              },
            },
            Guessing: {
              initial: 'Awaiting',
              onDone: [
                {
                  target: 'Complete',
                  cond: 'hasWinner',
                },
                {
                  target: 'GivingClue',
                },
              ],
              states: {
                Awaiting: {
                  entry: () => console.log('waaiting'),
                  on: {
                    HIGHLIGHT: {
                      actions: 'highlightWord',
                    },
                    GUESS: [
                      {
                        target: 'Correct',
                        cond: 'isGuessCorrect',
                        actions: 'setGuess',
                      },
                      {
                        target: 'Complete',
                        cond: 'isGuessNeutral',
                        actions: 'setGuess',
                      },
                      {
                        target: 'Complete',
                        cond: 'isGuessWrongTeam',
                        actions: 'setGuess',
                      },
                      {
                        target: 'Complete',
                        cond: 'isGuessTripWord',
                        actions: 'setGuess',
                      },
                    ],
                  },
                },
                Correct: {
                  always: [
                    {
                      target: 'Awaiting',
                      cond: 'hasGuessesRemaining',
                    },
                    {
                      target: 'Complete',
                    },
                  ],
                },
                Complete: {
                  entry: 'resetRound',
                  type: 'final',
                },
              },
            },
            Complete: {
              type: 'final',
            },
          },
        },
        GameOver: {},
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),

        isGuessCorrect: ({ room }, event) => {
          assertEventType(event, 'GUESS');

          const { board, currentTeam } = room.state;
          const isCorrect = !!board.find(
            (boardItem) =>
              boardItem.word === event.word &&
              boardItem.belongsTo === currentTeam &&
              boardItem.guessedBy === ''
          );
          return isCorrect;
        },

        isGuessNeutral: ({ room }, event) => {
          assertEventType(event, 'GUESS');

          const { board } = room.state;
          const isNeutral = !!board.find(
            (boardItem) =>
              boardItem.word === event.word &&
              boardItem.belongsTo === '' &&
              boardItem.guessedBy === ''
          );
          return isNeutral;
        },

        isGuessWrongTeam: ({ room }, event) => {
          assertEventType(event, 'GUESS');

          const { board, currentTeam } = room.state;
          const otherTeam = currentTeam === 'A' ? 'B' : 'A';
          const isWrongTeam = !!board.find(
            (boardItem) =>
              boardItem.word === event.word &&
              boardItem.belongsTo === otherTeam &&
              boardItem.guessedBy === ''
          );
          return isWrongTeam;
        },

        isGuessTripWord: ({ room }, event) => {
          assertEventType(event, 'GUESS');

          const { tripWord } = room.state;
          return tripWord === event.word;
        },

        hasWinner: ({ room }, event) => {
          return !!selectWinningTeam(
            room.state.toJSON() as CodebreakersStateSerialized
          );
        },

        hasGuessesRemaining: ({ room }, event) => {
          return room.state.guessesRemaining > 0;
        },
      },
      actions: {
        highlightWord: ({ room }, event) => {
          assertEventType(event, 'HIGHLIGHT');
          console.log(event);
          const player = Array.from(room.state.players.values()).find(
            (player) => player.userId === event.userId
          );

          if (player?.team !== room.state.currentTeam) {
            return;
          }

          const highlightedWords = player?.highlightedWords;
          if (!highlightedWords) {
            return;
          }

          if (player?.highlightedWords.has(event.word)) {
            player?.highlightedWords.delete(event.word);
          } else {
            player?.highlightedWords.add(event.word);
          }
        },
        assignPlayerTeam: ({ room }, event) => {
          assertEventType(event, 'JOIN_TEAM');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const player = room.state.players.get(event.userId)!;
          const oldTeam = player.team;
          player.team = event.team;

          // Reassing cluegiver
          if (player.clueGiver) {
            player.clueGiver = false;
            const newClueGiver = Array.from(room.state.players.values()).find(
              (player) => player.team === oldTeam
            );
            if (newClueGiver) {
              newClueGiver.clueGiver = true;
            }
          }
        },
        assignClueGiver: ({ room }, event) => {
          assertEventType(event, 'BECOME_CLUE_GIVER');
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const clueGiverPlayer = room.state.players.get(event.userId)!;

          room.state.players.forEach((player) => {
            if (player.team === clueGiverPlayer.team) {
              player.clueGiver = false;
            }
          });
          clueGiverPlayer.clueGiver = true;
        },

        resetRound: ({ room }) => {
          room.state.currentClue = '';
          room.state.currentClueCount = 0;
          room.state.players.forEach((player) => {
            player.highlightedWords.clear();
          });
        },

        setTeam: ({ room }) => {
          room.state.currentTeam = room.state.currentTeam === 'A' ? 'B' : 'A';
        },

        setupGame: ({ room }, event) => {
          const { board } = room.state;
          const words = pipe(wordList, A.shuffle, A.take(24));
          words.forEach((word) => {
            const boardItem = new CodebreakerBoardItem();
            boardItem.word = word;
            boardItem.guessedBy = '';
            boardItem.belongsTo = '';
            board.push(boardItem);
          });

          const shuffledBoard = A.shuffle(Array.from(board.values()));

          for (let i = 0; i < 9; i++) {
            shuffledBoard[i].belongsTo = 'A';
          }
          for (let i = 9; i < 17; i++) {
            shuffledBoard[i].belongsTo = 'B';
          }
          room.state.tripWord = shuffledBoard[18].word;
          room.state.currentTeam = 'B';
        },

        setGuess: ({ room }, event) => {
          assertEventType(event, 'GUESS');

          const { board, currentTeam } = room.state;

          const boardItem = board.find((boardItem) => {
            return boardItem.word === event.word;
          });

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          boardItem!.guessedBy = currentTeam;
          room.state.guessesRemaining--;
        },
      },
    }
  );
};

const wordList = [
  'apple',
  'banana',
  'orange',
  'grape',
  'pear',
  'peach',
  'cat',
  'dog',
  'bird',
  'fish',
  'mouse',
  'cow',
  'horse',
  'pig',
  'sheep',
  'goat',
  'elephant',
  'lion',
  'tiger',
  'bear',
  'zebra',
  'giraffe',
  'monkey',
  'chicken',
  'duck',
  'frog',
  'snake',
  'turtle',
  'crab',
  'shark',
  'whale',
  'octopus',
  'lobster',
  'spider',
  'ant',
  'bee',
  'butterfly',
  'fly',
  'mosquito',
  'car',
  'truck',
  'bus',
  'train',
  'boat',
  'airplane',
  'bicycle',
  'motorcycle',
  'helicopter',
  'rocket',
  'house',
  'tree',
  'flower',
  'mountain',
  'hill',
  'lake',
  'ocean',
  'waterfall',
  'island',
  'sand',
  'rock',
  'fire',
  'lightning',
  'snow',
  'rain',
  'wind',
  'earth',
  'cloud',
  'sun',
  'moon',
  'star',
  'snowflake',
  'snowman',
  'rainbow',
  'castle',
  'bridge',
  'road',
];

type CodebreakersServerMachine = ReturnType<
  typeof createCodebreakersServerMachine
>;
export type CodebreakersServerService = ActorRefFrom<CodebreakersServerMachine>;

const selectAllPlayersConnected = (state: CodebreakersState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};

// const selectSerializedState = (state: CodebreakersState) => {
//   return state.toJSON() as SerializedSchema<CodebreakersState>;
// };
