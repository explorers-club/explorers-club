import {
  LittleVigilanteCommand,
  LittleVigilanteServerEvent,
} from '@explorers-club/room';
import { MapSchema } from '@colyseus/schema';
import {
  LittleVigilanteConfigSchema,
  LittleVigilanteRoomId,
} from '@explorers-club/schema';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { LittleVigilantePlayer } from '@explorers-club/schema-types/LittleVigilantePlayer';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { Client, matchMaker, Room } from 'colyseus';
import { create } from 'domain';
import { Subject } from 'rxjs';
import { interpret } from 'xstate';
import {
  rolesByPlayerCount,
  ROLE_LIST,
} from '../meta/little-vigilante.constants';
import { createLittleVigilanteChatServerMachine } from './little-vigilante-chat-server.machine';
import {
  createLittleVigilanteServerMachine,
  LittleVigilanteServerService,
} from './little-vigilante-server.machine';
import { ChatState } from '@explorers-club/schema-types/ChatState';

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
  rolesToExclude: string[];
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
  private messageQueue: LittleVigilanteServerEvent[] = [];

  static async create({ roomId, clubRoom }: CreateProps) {
    const playerInfo: PlayerInfo[] = Array.from(
      clubRoom.state.players.entries()
    ).map(([userId, player]) => {
      return { userId, name: player.name.valueOf() };
    });

    const json =
      clubRoom.state.gameConfigsSerialized.get('little_vigilante') || '{}';
    const {
      votingTimeSeconds,
      discussionTimeSeconds,
      roundsToPlay,
      rolesToExclude,
    } = LittleVigilanteConfigSchema.parse(JSON.parse(json));

    const options = {
      roomId,
      playerInfo,
      votingTimeSeconds,
      discussionTimeSeconds,
      roundsToPlay,
      rolesToExclude,
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
      rolesToExclude,
    } = options;

    // initialize empty room state
    const state = new LittleVigilanteState();
    state.currentRound = 1;
    state.roundsToPlay = roundsToPlay;
    state.currentTick = 0;
    state.lastDownState = new MapSchema<number>();
    state.chat = new ChatState();
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

    const roles = ROLE_LIST.filter(
      (role) => !rolesToExclude.includes(role)
    ).slice(0, playerInfo.length + 3);

    roles.forEach((role) => state.roles.push(role));

    const room = this as Room<LittleVigilanteState>;
    const eventSubject$ = new Subject<LittleVigilanteServerEvent>();
    const settings = { votingTimeSeconds, discussionTimeSeconds, roundsToPlay };

    interpret(
      createLittleVigilanteChatServerMachine(room, eventSubject$)
    ).start();

    this.service = interpret(
      createLittleVigilanteServerMachine(room, settings)
    ).start();

    // todo remove or garbabe collect this?

    this.service.subscribe((state) => {
      eventSubject$.next(state.event);
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
      console.log(state.event);
      room.broadcast(state.event.type, state.event);
    });

    setInterval(() => {
      this.messageQueue.forEach((message) => {
        this.service.send(message);
      });
      room.state.currentTick = room.state.currentTick + 1;
      this.messageQueue.length = 0;
    }, 1000 / 60);

    this.onMessage('*', (client, _, message: LittleVigilanteCommand) => {
      const ts = room.state.currentTick + (this.messageQueue.length + 1) / 1000;
      this.messageQueue.push({
        ...message,
        ts,
        sender: {
          type: 'user' as const,
          userId: client.userData.userId as string,
        },
      });
    });
  }

  override onJoin(client: Client, options: OnJoinOptions) {
    const userId = options.userId as string;
    const player = this.state.players.get(userId);
    if (player) {
      player.connected = true;
      const ts = this.state.currentTick + (this.messageQueue.length + 1) / 1000;
      this.messageQueue.push({
        type: 'JOIN',
        ts,
        userId,
        sender: {
          // todo change this to be server since this is a server sent event
          type: 'user' as const,
          userId,
        },
      });
      client.userData = { userId };
    }
  }

  override async onLeave(client: Client) {
    if (client.userData) {
      const { userId } = client.userData;
      const player = this.state.players.get(userId);
      if (player) {
        player.connected = false;
      }
      const ts = this.state.currentTick + (this.messageQueue.length + 1) / 1000;
      this.messageQueue.push({
        type: 'DISCONNECT',
        ts,
        userId,
        sender: {
          userId,
          type: 'user' as const,
        },
      });
      try {
        await this.allowReconnection(client, 10000);
        const ts =
          this.state.currentTick + (this.messageQueue.length + 1) / 1000;
        this.service.send({
          type: 'RECONNECT',
          ts,
          userId,
          sender: {
            userId,
            type: 'user' as const,
          },
        });
      } catch (ex) {
        console.warn('player hasnt returned after 10000 seconds, do something');
      }
    }
  }

  override onDispose() {
    // clearInterval(this.heartbeatInterval);
    this.presence.publish(this.roomId, 'stopping');
  }
}
