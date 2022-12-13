import { Room, Client } from 'colyseus';
import { TriviaJamState } from './schema/TriviaJamState';

export class TriviaJamRoom extends Room<TriviaJamState> {
  TRIVIA_JAM_CHANNEL = '#trivia_jam';

  async assertRoomDoesntExist(roomId: string): Promise<string> {
    const currentRooms = await this.presence.smembers(this.TRIVIA_JAM_CHANNEL);
    if (currentRooms.includes(roomId)) {
      // Should only happen if clients race to create same channel
      throw new Error(`tried to create ${roomId} but it already exists`);
    }

    // Lock ourselves to hosting it
    await this.presence.sadd(this.TRIVIA_JAM_CHANNEL, roomId);
    return roomId;
  }

  async onCreate(options) {
    this.roomId = await this.assertRoomDoesntExist(options.roomId);

    // initialize empty room state
    this.setState(new TriviaJamState());
  }

  onJoin(client: Client) {
    console.log(client.sessionId, 'joined!', this.roomId, this.roomName);
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }

  async onDispose() {
    this.presence.srem(this.TRIVIA_JAM_CHANNEL, this.roomId);
  }
}
