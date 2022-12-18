import { Room, Client, matchMaker } from 'colyseus';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamRoomId } from '@explorers-club/schema';

interface CreateProps {
  roomId: TriviaJamRoomId;
  clubRoom: Room<ClubState>;
}

export class TriviaJamRoom extends Room<TriviaJamState> {
  static async create({ roomId, clubRoom }: CreateProps) {
    return await matchMaker.createRoom('trivia_jam', {
      roomId,
    });
  }

  async onCreate(options) {
    console.log('create tj', options);
    const { roomId } = options;
    this.roomId = roomId;
    this.autoDispose = false;
    const state = new TriviaJamState();
    this.setState(state);
  }

  onJoin(client: Client, options) {
    console.log(
      client.sessionId,
      'joined!',
      this.roomId,
      this.roomName,
      options
    );
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }

  async onDispose() {}
}
