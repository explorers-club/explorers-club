/* eslint-disable no-case-declarations */
import { DiffusionaryRoom } from '@explorers-club/diffusionary/server';
import { LittleVigilanteRoom } from '@explorers-club/little-vigilante/server';
import { ClubRoomServerEvent, ClubStateSerialized } from '@explorers-club/room';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/server';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';
import { selectGameConfig } from './club-room.selectors';

type GameConfig = ReturnType<typeof selectGameConfig>;

export interface ClubRoomServerContext {
  room: Room<ClubState>;
}

export const createClubServerMachine = (room: Room<ClubState>) => {
  const gameConfig = selectGameConfig(getSnapshot(room.state));

  const openSlots = Array(gameConfig.maxPlayers)
    .fill(0)
    .map((_, i) => i + 2);

  const machine = createMachine(
    {
      id: 'ClubServerMachine',
      initial: 'WaitingForPlayers',
      context: {
        room,
      },
      schema: {
        context: {} as ClubRoomServerContext,
        events: {} as ClubRoomServerEvent,
      },
      on: {
        JOIN: {
          actions: ({ room }, event) => {
            if (!room.state.hostUserId) {
              room.state.hostUserId = event.userId;
            }

            let player = room.state.players.get(event.userId);
            if (!player) {
              player = new ClubPlayer();
              player.userId = event.userId;
              room.state.players.set(event.userId, player);
            }
            player.connected = true;
          },
        },
        MESSAGE: {
          actions: (context, event) => {
            // Rebroadcast any sent messgae
            context.room.broadcast(event.type, event);
          },
        },
        RECONNECT: {
          actions: ({ room }, event) => {
            const player = room.state.players.get(event.userId);
            if (player) {
              player.connected = true;
            }
          },
        },
        DISCONNECT: {
          actions: ({ room }, event) => {
            const player = room.state.players.get(event.userId);
            if (player) {
              player.connected = false;
            }
          },
        },
        LEAVE: {
          actions: ({ room }, event) => {
            const player = room.state.players.get(event.userId);
            if (player.slotNumber) {
              openSlots.unshift(player.slotNumber);
            }
            room.state.players.delete(event.userId);
          },
        },
        ENTER_NAME: {
          actions: ({ room }, event) => {
            const { userId, playerName } = event;

            const player = room.state.players.get(userId);
            if (!player) {
              console.warn(
                "expected player but didn't find one for userId: " + userId
              );
              return;
            }

            player.name = playerName;
            player.slotNumber = openSlots.shift();
          },
        },
      },
      states: {
        WaitingForPlayers: {
          on: {
            START_GAME: {
              target: 'Starting',
              cond: 'allRequirementsMet',
            },
            SELECT_GAME: {
              target: 'WaitingForPlayers',
              actions: ({ room }, event) => {
                room.state.selectedGame = event.gameId;
              },
            },
            SET_GAME_CONFIG: {
              target: 'WaitingForPlayers',
              actions: ({ room }, event) => {
                room.state.gameConfigsSerialized.set(
                  event.config.gameId,
                  JSON.stringify(event.config)
                );
              },
            },
          },
        },
        Starting: {
          invoke: {
            src: 'startGame',
            onDone: 'WaitingForPlayers',
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        allRequirementsMet: ({ room }) => {
          const config = selectGameConfig(getSnapshot(room.state));
          const playerCount = room.state.players.size;

          const notAlreadyStarted =
            room.state.gameRoomIds.has(config.gameId) === false;
          // todo: make these requirements a zod schema?

          return (
            notAlreadyStarted &&
            config.minPlayers <= playerCount &&
            playerCount <= config.maxPlayers
          );
        },
      },
      actions: {},
      services: {
        startGame: async ({ room }) => {
          const roomName = room.roomId.replace('club-', '');

          const gameConfig = selectGameConfig(getSnapshot(room.state));
          const gameRoom = await createRoom(gameConfig, roomName, room);

          room.state.gameRoomIds.add(gameRoom.roomId);
          await room.presence.publish(gameRoom.roomId, 'running');
          room.presence.subscribe(gameRoom.roomId, (data) => {
            if (data !== 'running') {
              room.state.gameRoomIds.delete(gameRoom.roomId);
              room.presence.del(gameRoom.roomId);
            }
          });
          // await room.presence.publish(gameRoom.roomId, 'running1');

          //   await new Promise((resolve) => {
          //     const onChangeGameRooms = async () => {
          //       const isMember = await room.presence.sismember(
          //         GAME_ROOMS_TOPIC,
          //         gameRoom.roomId
          //       );
          //       if (isMember) {
          //         return;
          //       }
          //       // If game server no longer running, we're done
          //       resolve(null);
          //       room.presence.unsubscribe(GAME_ROOMS_TOPIC, onChangeGameRooms);
          //     };

          //     room.presence.subscribe(GAME_ROOMS_TOPIC, onChangeGameRooms);
          //   });
        },
      },
    }
  );
  return machine;
};

const getSnapshot = (state: ClubState) => {
  return state.toJSON() as ClubStateSerialized;
};

const createRoom = async (
  config: GameConfig,
  clubName: string,
  clubRoom: Room<ClubState>
) => {
  switch (config.gameId) {
    case 'trivia_jam':
      return await TriviaJamRoom.create({
        roomId: `trivia_jam-${clubName}`,
        clubRoom,
      });
    case 'diffusionary':
      return await DiffusionaryRoom.create({
        roomId: `diffusionary-${clubName}`,
        clubRoom,
      });
    case 'little_vigilante':
      return await LittleVigilanteRoom.create({
        roomId: `little_vigilante-${clubName}`,
        clubRoom,
      });
    default:
      throw new Error('Game room not found');
  }
};

type ClubServerMachine = ReturnType<typeof createClubServerMachine>;
export type ClubServerService = ActorRefFrom<ClubServerMachine>;
