import { Room, Client, matchMaker } from 'colyseus';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { DiffusionaryRoomId } from '@explorers-club/schema';

interface CreateProps {
  roomId: DiffusionaryRoomId;
  clubRoom: Room<ClubState>;
}

export class DiffusionaryRoom extends Room<DiffusionaryState> {
  static async create({ roomId, clubRoom }: CreateProps) {
    // todo
    const room = await matchMaker.createRoom('diffusionary', {
      roomId,
    });
    return room;
  }

  async onCreate(options) {
    // initialize empty room state
    this.setState(new DiffusionaryState());
  }

  onJoin(client: Client) {
    console.log(client.sessionId, 'joined!', this.roomId, this.roomName);
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }
}
