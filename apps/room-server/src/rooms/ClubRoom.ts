import { DiffusionaryRoom } from '@explorers-club/diffusionary/server';
import { LittleVigilanteRoom } from '@explorers-club/little-vigilante/server';
import {
  ClubRoomEnterNameCommand,
  ClubRoomSelectGameCommand,
  ClubRoomSetGameConfigCommand,
  CLUB_ROOM_ENTER_NAME,
  CLUB_ROOM_SELECT_GAME,
  CLUB_ROOM_SET_GAME_CONFIG,
  CLUB_ROOM_START_GAME,
  GameId, GAME_LIST
} from '@explorers-club/room';
import { ClubMetadata } from '@explorers-club/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/server';
import { Client, matchMaker, Room, RoomListingData } from 'colyseus';

const DEFAULT_GAME = GAME_LIST[0];

// trivia jam defaults
const DEFAULT_MAX_PLAYERS = 8;

export class ClubRoom extends Room<ClubState> {
  ROOMS_CHANNEL = '#rooms';

  private openSlots: number[];

  async onCreate(options) {
    // Set up colyseus params
    const { roomId, userId } = options;

    this.roomId = roomId;
    this.autoDispose = false;

    // Set up config
    // const config = new TriviaJamConfig();
    // config.questionSetEntryId = DEFAULT_QUESTION_SET_ENTRY_ID;
    // config.maxPlayers = DEFAULT_MAX_PLAYERS;

    // Initialize open spots
    this.openSlots = Array(DEFAULT_MAX_PLAYERS - 1)
      .fill(0)
      .map((_, i) => i + 2);
    const clubName = this.roomId.replace('club-', '');

    // Set up initialize state ane metadata
    const metadata: ClubMetadata = {
      clubName,
    };
    this.setMetadata(metadata);

    const hostPlayer = new ClubPlayer();
    hostPlayer.name = clubName;
    hostPlayer.userId = userId;
    hostPlayer.slotNumber = 1;
    hostPlayer.connected = true;

    const state = new ClubState();
    state.hostUserId = userId;
    state.selectedGame = DEFAULT_GAME;
    state.players.set(userId, hostPlayer);
    this.setState(state);

    // TODO pull the message handlers in to server state machine
    this.onMessage(
      CLUB_ROOM_ENTER_NAME,
      (client, command: ClubRoomEnterNameCommand) => {
        const { userId } = client.userData;
        const { playerName } = command;
        const existingNames = Array.from(state.players.entries()).map(
          ([_, player]) => player.name
        );
        if (!existingNames.includes(playerName)) {
          const slotNumber = this.openSlots.shift();
          const player = new ClubPlayer();
          player.name = playerName;
          player.userId = userId;
          player.slotNumber = slotNumber;
          player.connected = true;

          state.players.set(userId, player);
        }
      }
    );

    this.onMessage(
      CLUB_ROOM_SET_GAME_CONFIG,
      async (_, command: ClubRoomSetGameConfigCommand) => {
        state.gameConfigsSerialized.set(
          command.config.gameId,
          JSON.stringify(command.config)
        );
      }
    );

    this.onMessage(
      CLUB_ROOM_SELECT_GAME,
      async (_, { gameId }: ClubRoomSelectGameCommand) => {
        this.state = this.state.assign({
          selectedGame: gameId,
        });
        // todo if maxPLayers changed then might need to do something
        // to make the game not startable, or lock lobby from being joinable.
      }
    );

    this.onMessage(CLUB_ROOM_START_GAME, async () => {
      // Don't start a game if it's already started
      if (this.state.gameRoomId) {
        return;
      }

      const roomName = this.roomId.replace('club-', '');
      const gameId = this.state.selectedGame as GameId;
      const gameRoomId = `${gameId}-${roomName}` as const;

      let gameRoom: RoomListingData<any>;
      if (gameId === 'trivia_jam') {
        gameRoom = await TriviaJamRoom.create({
          roomId: `trivia_jam-${clubName}`,
          clubRoom: this,
        });
      } else if (gameId === 'diffusionary') {
        gameRoom = await DiffusionaryRoom.create({
          roomId: `diffusionary-${clubName}`,
          clubRoom: this,
        });
      } else if (gameId === 'little_vigilante') {
        gameRoom = await LittleVigilanteRoom.create({
          roomId: `little_vigilante-${clubName}`,
          clubRoom: this,
        });
      } else {
        console.warn("couldn't find room for " + gameId);
      }

      // Make a reservation for everybody currently connected
      const reservations = await Promise.all(
        this.clients.map(
          async () => await matchMaker.reserveSeatFor(gameRoom, {})
        )
      );

      this.clients.forEach((client, index) => {
        client.send('RESERVED_GAME_SEAT', reservations[index]);
      });

      this.state = this.state.assign({
        gameRoomId,
      });
    });
  }

  onJoin(client: Client, options) {
    const { userId } = options;
    // Set the hostSessionId to be the first person that connects
    if (!this.state.hostUserId) {
      this.setState(
        this.state.assign({
          hostUserId: options.userId as string,
        })
      );
    }

    client.userData = { userId };
  }

  async onLeave(client: Client) {
    const userId = client.userData.userId;
    // When player leaves, hold for 30 seconds before they disconnect
    const player = this.state.players.get(userId);
    if (!player) {
      return;
    }

    player.connected = false;
    try {
      await this.allowReconnection(client, 30);
      player.connected = true;
    } catch (ex) {
      this.state.players.delete(userId);
      this.openSlots.unshift(player.slotNumber);
    }
  }

  onDispose() {
    console.log('disposing', this.roomId);
  }
}
