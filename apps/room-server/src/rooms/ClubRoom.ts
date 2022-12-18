import {
  ClubRoomEnterNameCommand,
  ClubRoomSelectGameCommand,
  CLUB_ROOM_ENTER_NAME,
  CLUB_ROOM_SELECT_GAME,
  CLUB_ROOM_START_GAME,
} from '@explorers-club/commands';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { Client, matchMaker, Room } from 'colyseus';
import { TriviaJamRoom } from './TriviaJamRoom';

export class ClubRoom extends Room<ClubState> {
  ROOMS_CHANNEL = '#rooms';

  async onCreate(options) {
    const { roomId } = options;

    const state = new ClubState({});
    this.setState(state);
    this.roomId = roomId;
    this.autoDispose = false;
    this.state.selectedGame = 'trivia_jam';

    // TODO pull the message handlers in to server state machine
    this.onMessage(
      CLUB_ROOM_ENTER_NAME,
      (client, command: ClubRoomEnterNameCommand) => {
        const { playerName } = command;
        const existingNames = Array.from(state.players.entries()).map(
          ([_, player]) => player.name
        );
        if (!existingNames.includes(playerName)) {
          const player = new ClubPlayer({
            name: playerName,
          });
          state.players[client.sessionId] = player;
        }
      }
    );

    this.onMessage(
      CLUB_ROOM_SELECT_GAME,
      (client, command: ClubRoomSelectGameCommand) => {
        console.log(client.sessionId, command);
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

  onJoin(client: Client) {
    // Set the hostSessionId to be the first person that connects
    // const hostSessionId = this.state.hostSessionId.valueOf();
    if (!this.state.hostSessionId) {
      this.setState(
        this.state.assign({
          hostSessionId: client.sessionId,
        })
      );
    }
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
