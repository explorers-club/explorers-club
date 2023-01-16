import { Room, Client, matchMaker } from 'colyseus';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { CodebreakersRoomId } from '@explorers-club/schema';
import {
  createCodebreakersServerMachine,
  CodebreakersServerService,
} from './codebreakers-server.machine';
import { CodebreakersState } from '@explorers-club/schema-types/CodebreakersState';
import { interpret } from 'xstate';
import { CodebreakersPlayer } from '@explorers-club/schema-types/CodebreakersPlayer';
import {
  CodebreakersBecomeClueGiverCommand,
  CodebreakersClueCommand,
  CodebreakersGuessCommand,
  CodebreakersHighlightCommand,
  CodebreakersJoinTeamCommand,
  CONTINUE,
} from '@explorers-club/room';

interface PlayerInfo {
  userId: string;
  name: string;
}

export interface OnCreateOptions {
  roomId: string;
  playerInfo: PlayerInfo[];
}

interface OnJoinOptions {
  userId: string;
}

interface CreateProps {
  roomId: CodebreakersRoomId;
  clubRoom: Room<ClubState>;
}

export class CodebreakersRoom extends Room<CodebreakersState> {
  private service!: CodebreakersServerService;

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
    return await matchMaker.createRoom('codebreakers', options);
  }

  override async onCreate(options: OnCreateOptions) {
    const { roomId, playerInfo } = options;

    // initialize empty room state
    const state = new CodebreakersState();
    this.setState(state);

    this.roomId = roomId;
    this.autoDispose = false;

    playerInfo.forEach(({ userId, name }, index) => {
      const player = new CodebreakersPlayer();
      player.name = name;
      player.connected = false;
      player.userId = userId;
      player.team = index % 2 === 0 ? 'A' : 'B';
      player.clueGiver = index < 2;
      state.players.set(userId, player);
    });

    state.hostUserIds.add(playerInfo[0].userId);

    const room = this as Room<CodebreakersState>;
    this.service = interpret(createCodebreakersServerMachine(room)).start();
    this.service.subscribe((state) => {
      room.state.currentStates.clear();
      console.log(state.value);
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    this.onMessage('CLUE', (client, message: CodebreakersClueCommand) => {
      this.service.send({
        ...message,
        userId: client.userData.userId as string,
      });
    });

    this.onMessage('GUESS', (client, message: CodebreakersGuessCommand) => {
      this.service.send({
        ...message,
        userId: client.userData.userId as string,
      });
    });

    this.onMessage(
      'HIGHLIGHT',
      (client, message: CodebreakersHighlightCommand) => {
        this.service.send({
          ...message,
          userId: client.userData.userId as string,
        });
      }
    );

    this.onMessage(
      'BECOME_CLUE_GIVER',
      (client, message: CodebreakersBecomeClueGiverCommand) => {
        this.service.send({
          ...message,
          userId: client.userData.userId as string,
        });
      }
    );

    this.onMessage(
      'JOIN_TEAM',
      (client, message: CodebreakersJoinTeamCommand) => {
        this.service.send({
          ...message,
          userId: client.userData.userId as string,
        });
      }
    );

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
      console.log(player.name + ' connected');
    }
    this.service.send({ type: 'JOIN', userId });
    client.userData = { userId };
  }

  override onLeave(client: Client) {
    const { userId } = client.userData;
    const player = this.state.players.get(userId);
    if (player) {
      player.connected = false;
      console.log(player.name + ' disconnected');
    }
    this.service.send({ type: 'LEAVE', userId });
  }
}
