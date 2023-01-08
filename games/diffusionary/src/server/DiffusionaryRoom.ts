import { DiffusionaryRoomId } from '@explorers-club/schema';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { DiffusionaryPlayer } from '@explorers-club/schema-types/DiffusionaryPlayer';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { Client, matchMaker, Room } from 'colyseus';
import { interpret } from 'xstate';
import {
  createDiffusionaryServerMachine,
  DiffusionaryServerService
} from './diffusionary-server.machine';

interface PlayerInfo {
  userId: string;
  name: string;
}

interface OnCreateOptions {
  roomId: string;
  playerInfo: PlayerInfo[];
}

interface CreateProps {
  roomId: DiffusionaryRoomId;
  clubRoom: Room<ClubState>;
}

export class DiffusionaryRoom extends Room<DiffusionaryState> {
  private service!: DiffusionaryServerService;

  static async create({ roomId, clubRoom }: CreateProps) {
    const playerInfo: PlayerInfo[] = Array.from(
      clubRoom.state.players.entries()
    ).map(([userId, player]) => {
      return { userId, name: player.name.valueOf() };
    });

    const options = {
      roomId,
      playerInfo,
    } as OnCreateOptions;

    // todo
    return await matchMaker.createRoom('diffusionary', options);
  }

  override async onCreate(options: OnCreateOptions) {
    const { roomId, playerInfo } = options;

    // initialize empty room state
    const state = new DiffusionaryState();
    this.setState(state);

    this.roomId = roomId;
    this.autoDispose = false;

    playerInfo.forEach(({ userId, name }) => {
      const player = new DiffusionaryPlayer({
        name,
        connected: false,
        score: 0,
        userId,
      });
      state.players.set(userId, player);
    });

    const room = this as Room<DiffusionaryState>;
    this.service = interpret(createDiffusionaryServerMachine(room)).start();
    this.service.subscribe((state) => {
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });
  }

  override onJoin(client: Client) {
    console.log(client.sessionId, 'joined!', this.roomId, this.roomName);
  }

  override onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }
}
