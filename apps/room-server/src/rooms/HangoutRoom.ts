import { Room, Client } from 'colyseus';
import { HangoutState } from '@explorers-club/schema';

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

    this.onMessage('SET_NAME', (client, name) => {
      state.playerNames[client.id] = name;
      // this.setState(state);
    });
    this.onMessage('SET_GAME', (_, game) => {
      this.setState(
        state.assign({
          selectedGame: game,
        })
      );
    });
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
