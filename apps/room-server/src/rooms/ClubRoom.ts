import {
  ClubRoomEnterNameCommand,
  CLUB_ROOM_ENTER_NAME,
  CLUB_ROOM_START_GAME,
} from '@explorers-club/commands';
import { ClubMetadata } from '@explorers-club/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/server';
import { Client, matchMaker, Room } from 'colyseus';

export class ClubRoom extends Room<ClubState> {
  ROOMS_CHANNEL = '#rooms';

  async onCreate(options) {
    const { roomId, userId } = options;

    this.roomId = roomId;
    this.autoDispose = false;

    const metadata: ClubMetadata = {
      clubName: this.roomId.replace('club-', ''),
    };
    this.setMetadata(metadata);

    const state = new ClubState();
    state.hostUserId = userId;
    state.selectedGame = 'trivia_jam';
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
          const player = new ClubPlayer({
            name: playerName,
          });
          state.players.set(userId, player);
        }
      }
    );

    this.onMessage(CLUB_ROOM_START_GAME, async () => {
      // Don't start a game if it's already started
      if (this.state.gameRoomId) {
        return;
      }

      const roomPath = this.roomId.replace('club-', '');
      const gameRoomId = `trivia_jam-${roomPath}` as const;

      // todo add diffusionary
      const gameRoom = await TriviaJamRoom.create({
        roomId: gameRoomId,
        clubRoom: this,
      });

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
    // When player leaves, hold for 30 seconds before they disconnect
    const player = this.state.players.get(client.sessionId);
    if (!player) {
      return;
    }

    this.state.players.get(client.sessionId).connected = false;
    try {
      await this.allowReconnection(client, 30);
      this.state.players.get(client.sessionId).connected = true;
    } catch (ex) {
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log('disposing', this.roomId);
  }
}
