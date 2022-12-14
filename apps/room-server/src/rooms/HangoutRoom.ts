import { Room, Client } from 'colyseus';
import { HangoutState } from '@explorers-club/schema';
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

  async assertRoomDoesntExist(roomId: string): Promise<string> {
    const currentRooms = await this.presence.smembers(this.ROOMS_CHANNEL);
    if (currentRooms.includes(roomId)) {
      // Should only happen if clients race to create same channel
      throw new Error(`tried to create ${roomId} but it already exists`);
    }

    // Lock ourselves to hosting it
    await this.presence.sadd(this.ROOMS_CHANNEL, roomId);

    return roomId;
  }

  async onCreate(options) {
    this.roomId = await this.assertRoomDoesntExist(options.roomId);

    // initialize empty room state
    const state = new HangoutState();
    this.setState(state);

    this.onMessage(
      HANGOUT_ROOM_ENTER_NAME,
      (client, command: HangoutRoomEnterNameCommand) => {
        state.playerNames[client.id] = command.playerName;
      }
    );

    this.onMessage(
      HANGOUT_ROOM_SELECT_GAME,
      (client, command: HangoutRoomSelectGameCommand) => {
        console.log(client, command);
      }
    );

    this.onMessage(
      HANGOUT_ROOM_START_GAME,
      (client, command: HangoutRoomStartGameCommand) => {
        console.log(client, command);
      }
    );
  }

  onJoin(client: Client) {
    console.log(client.sessionId, 'joined!', this.roomId, this.roomName);
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }

  async onDispose() {
    this.presence.srem(this.ROOMS_CHANNEL, this.roomId);
  }
}
