import { Room, Client } from 'colyseus';
import { HangoutState, Player } from '@explorers-club/schema';
import {
  HangoutRoomEnterNameCommand,
  HangoutRoomSelectGameCommand,
  HangoutRoomStartGameCommand,
  HANGOUT_ROOM_ENTER_NAME,
  HANGOUT_ROOM_SELECT_GAME,
  HANGOUT_ROOM_START_GAME,
} from '@explorers-club/commands';

export class HangoutRoom extends Room<HangoutState> {
  ROOMS_CHANNEL = '#rooms';

  async onCreate(options) {
    const { roomId } = options;
    // Lock ourselves to hosting it
    // await this.presence.sadd(this.ROOMS_CHANNEL, roomId);

    const state = new HangoutState();
    this.setState(state);
    this.roomId = roomId;
    this.state.selectedGame = 'trivia_jam';

    this.onMessage(
      HANGOUT_ROOM_ENTER_NAME,
      (client, command: HangoutRoomEnterNameCommand) => {
        const { playerName } = command;
        const existingNames = Array.from(state.players.entries()).map(
          ([_, player]) => player.name
        );
        if (!existingNames.includes(playerName)) {
          const player = new Player({
            name: playerName,
          });
          state.players[client.sessionId] = player;
        }
      }
    );

    this.onMessage(
      HANGOUT_ROOM_SELECT_GAME,
      (client, command: HangoutRoomSelectGameCommand) => {
        console.log(client.sessionId, command);
      }
    );

    this.onMessage(
      HANGOUT_ROOM_START_GAME,
      (client, command: HangoutRoomStartGameCommand) => {
        console.log(client.sessionId, command);
      }
    );
  }

  onJoin(client: Client) {
    console.log(client.sessionId, 'joined!', this.roomId, this.roomName);
  }

  async onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    // Anyone player, hold them for 30 seconds before they disconnect
    if (!player) {
      return;
    }

    this.state.players.get(client.sessionId).connected = false;
    try {
      await this.allowReconnection(client, 30);
      this.state.players.get(client.sessionId).connected = true;
      console.log('reconnected', this.state.players.values());
    } catch (ex) {
      console.log('removing player');
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log('disposing', this.roomId);
  }
}
