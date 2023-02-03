import { LittleVigilanteCommand } from '@explorers-club/room';
import {
  LittleVigilanteConfigSchema,
  LittleVigilanteRoomId,
} from '@explorers-club/schema';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { LittleVigilantePlayer } from '@explorers-club/schema-types/LittleVigilantePlayer';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { Client, matchMaker, Room } from 'colyseus';
import { interpret } from 'xstate';
import { rolesByPlayerCount } from '../meta/little-vigilante.constants';
import {
  createLittleVigilanteServerMachine,
  LittleVigilanteServerService,
} from './little-vigilante-server.machine';

interface PlayerInfo {
  userId: string;
  name: string;
}

export interface OnCreateOptions {
  roomId: string;
  playerInfo: PlayerInfo[];
  votingTimeSeconds: number;
  roundsToPlay: number;
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

    const json =
      clubRoom.state.gameConfigsSerialized.get('little_vigilante') || '{}';
    const { votingTimeSeconds, discussionTimeSeconds, roundsToPlay } =
      LittleVigilanteConfigSchema.parse(JSON.parse(json));

    const options = {
      roomId,
      playerInfo,
      votingTimeSeconds,
      discussionTimeSeconds,
      roundsToPlay,
    } as OnCreateOptions;

    // todo
    return await matchMaker.createRoom('little_vigilante', options);
  }

  override async onCreate(options: OnCreateOptions) {
    const {
      roomId,
      playerInfo,
      votingTimeSeconds,
      discussionTimeSeconds,
      roundsToPlay,
    } = options;

    // initialize empty room state
    const state = new LittleVigilanteState();
    state.currentRound = 1;
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

    roles.forEach((role) => state.roles.push(role));

    const room = this as Room<LittleVigilanteState>;
    const settings = { votingTimeSeconds, discussionTimeSeconds, roundsToPlay };
    this.service = interpret(
      createLittleVigilanteServerMachine(room, settings)
    ).start();
    this.service.subscribe((state) => {
      console.log(state.value, state.event);
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    this.onMessage('*', (client, _, message: LittleVigilanteCommand) => {
      this.service.send({
        ...message,
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
    if (client.userData) {
      const { userId } = client.userData;
      const player = this.state.players.get(userId);
      if (player) {
        player.connected = false;
      }
      this.service.send({ type: 'LEAVE', userId });
    }
  }

  override onDispose() {
    // clearInterval(this.heartbeatInterval);
    this.presence.publish(this.roomId, 'stopping');
  }
}
