import { Room, Client, matchMaker } from 'colyseus';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import {
  LittleVigilanteConfigSchema,
  LittleVigilanteRoomId,
} from '@explorers-club/schema';
import {
  createLittleVigilanteServerMachine,
  LittleVigilanteServerService,
} from './little-vigilante-server.machine';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { interpret } from 'xstate';
import { LittleVigilantePlayer } from '@explorers-club/schema-types/LittleVigilantePlayer';
import {
  CONTINUE,
  LittleVigilanteArrestCommand,
  LittleVigilanteSwapCommand,
  LittleVigilanteTargetPlayerRoleCommand,
  LittleVigilanteVoteCommand,
} from '@explorers-club/room';
import { rolesByPlayerCount } from '../meta/little-vigilante.constants';

interface PlayerInfo {
  userId: string;
  name: string;
}

export interface OnCreateOptions {
  roomId: string;
  playerInfo: PlayerInfo[];
  votingTimeSeconds: number;
  discussionTimeSeconds: number;
}

interface OnJoinOptions {
  userId: string;
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

    const json = clubRoom.state.gameConfigsSerialized.get('little_vigilante');
    const { votingTimeSeconds, discussionTimeSeconds } =
      LittleVigilanteConfigSchema.parse(json);

    const options = {
      roomId,
      playerInfo,
      votingTimeSeconds,
      discussionTimeSeconds,
    } as OnCreateOptions;

    // todo
    return await matchMaker.createRoom('little_vigilante', options);
  }

  override async onCreate(options: OnCreateOptions) {
    const { roomId, playerInfo, votingTimeSeconds, discussionTimeSeconds } =
      options;

    // initialize empty room state
    const state = new LittleVigilanteState();
    this.setState(state);

    this.roomId = roomId;
    this.autoDispose = false;

    playerInfo.forEach(({ userId, name }, index) => {
      const player = new LittleVigilantePlayer({
        name,
        connected: false,
        score: 0,
        userId,
        slotNumber: index + 1,
      });
      state.players.set(userId, player);
    });

    state.hostUserIds.add(playerInfo[0].userId);

    const roles = rolesByPlayerCount[playerInfo.length];
    roles.forEach((role) => state.roles.add(role));

    const room = this as Room<LittleVigilanteState>;
    const settings = { votingTimeSeconds, discussionTimeSeconds };
    this.service = interpret(
      createLittleVigilanteServerMachine(room, settings)
    ).start();
    this.service.subscribe((state) => {
      console.log(state.value, state.event);
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    this.onMessage(
      'TARGET_ROLE',
      (client, message: LittleVigilanteTargetPlayerRoleCommand) => {
        this.service.send({
          ...message,
          userId: client.userData.userId as string,
        });
      }
    );

    this.onMessage(
      'ARREST',
      (client, message: LittleVigilanteArrestCommand) => {
        this.service.send({
          ...message,
          userId: client.userData.userId as string,
        });
      }
    );

    this.onMessage('SWAP', (client, message: LittleVigilanteSwapCommand) => {
      this.service.send({
        ...message,
        userId: client.userData.userId as string,
      });
    });

    this.onMessage('VOTE', (client, message: LittleVigilanteVoteCommand) => {
      this.service.send({
        ...message,
        userId: client.userData.userId as string,
      });
    });

    this.onMessage(CONTINUE, (client) => {
      this.service.send({
        type: CONTINUE,
        userId: client.userData.userId as string,
      });
    });
  }

  override onJoin(client: Client, options: OnJoinOptions) {
    const userId = options.userId;

    const player = this.state.players.get(userId);
    if (player) {
      player.connected = true;
      this.service.send({ type: 'JOIN', userId });
      client.userData = { userId };
    }
  }

  override onLeave(client: Client) {
    const { userId } = client.userData;
    const player = this.state.players.get(userId);
    if (player) {
      player.connected = false;
    }
    this.service.send({ type: 'LEAVE', userId });
  }
}
