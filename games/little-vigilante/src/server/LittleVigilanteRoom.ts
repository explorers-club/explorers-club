import { Room, Client, matchMaker } from 'colyseus';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { LittleVigilanteRoomId } from '@explorers-club/schema';
import {
  createLittleVigilanteServerMachine,
  LittleVigilanteServerService,
} from './little-vigilante-server.machine';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { interpret } from 'xstate';
import { LittleVigilantePlayer } from '@explorers-club/schema-types/LittleVigilantePlayer';

interface PlayerInfo {
  userId: string;
  name: string;
}

interface OnCreateOptions {
  roomId: string;
  playerInfo: PlayerInfo[];
}

interface CreateProps {
  roomId: LittleVigilanteRoomId;
  clubRoom: Room<ClubState>;
}

export class LittleVigilanteRoom extends Room<LittleVigilanteState> {
  private service!: LittleVigilanteServerService;

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
    return await matchMaker.createRoom('little_vigilante', options);
  }

  override async onCreate(options: OnCreateOptions) {
    const { roomId, playerInfo } = options;

    // initialize empty room state
    const state = new LittleVigilanteState();
    this.setState(state);

    this.roomId = roomId;
    this.autoDispose = false;

    playerInfo.forEach(({ userId, name }) => {
      const player = new LittleVigilantePlayer({
        name,
        connected: false,
        score: 0,
        userId,
      });
      state.players.set(userId, player);
    });

    const room = this as Room<LittleVigilanteState>;
    this.service = interpret(createLittleVigilanteServerMachine(room)).start();
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
