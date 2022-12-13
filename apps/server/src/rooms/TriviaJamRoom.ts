import { Room, Client } from 'colyseus';
import { TriviaJamState } from './schema/TriviaJamState';

export class TriviaJamRoom extends Room<TriviaJamState> {
  TRIVIA_JAM_CHANNEL = '#trivia_jam';

  async onCreate(options) {
    // initialize empty room state
    this.setState(new TriviaJamState());

    console.log('on create', options);
    const roomId = options.roomId as string;
    await this.presence.sadd(this.TRIVIA_JAM_CHANNEL, roomId);
    this.roomId = options.roomId;
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
