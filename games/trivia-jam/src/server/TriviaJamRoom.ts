import { contentfulClient } from '@explorers-club/contentful';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import {
  CONTINUE,
  JOIN,
  LEAVE,
  TriviaJamSubmitResponseCommand,
  TRIVIA_JAM_SUBMIT_RESPONSE,
} from '@explorers-club/room';
import { TriviaJamRoomId } from '@explorers-club/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Client, matchMaker, Room } from 'colyseus';
import { interpret } from 'xstate';
import {
  createTriviaJamServerMachine,
  TriviaJamServerService,
} from './trivia-jam-server.machine';

const sampleQuestionSetEntryId = '3Xd6DkL434TO1AFYI1TME2';

interface CreateProps {
  roomId: TriviaJamRoomId;
  clubRoom: Room<ClubState>;
}

interface PlayerInfo {
  userId: string;
  name: string;
}

interface OnCreateOptions {
  roomId: string;
  userId: string;
  playerInfo: PlayerInfo[];
  questionSetEntryId: string;
}

export class TriviaJamRoom extends Room<TriviaJamState> {
  private service!: TriviaJamServerService;

  static async create({ roomId, clubRoom }: CreateProps) {
    const hostUserId = clubRoom.state.hostUserId.valueOf();

    const playerInfo: PlayerInfo[] = Array.from(
      clubRoom.state.players.entries()
    ).map(([userId, player]) => {
      return { userId, name: player.name.valueOf() };
    });

    const options: OnCreateOptions = {
      roomId,
      userId: hostUserId,
      questionSetEntryId: sampleQuestionSetEntryId,
      playerInfo,
    };

    return await matchMaker.createRoom('trivia_jam', options);
  }

  async onCreate(options: OnCreateOptions) {
    const {
      roomId,
      userId: hostUserId,
      playerInfo,
      questionSetEntryId,
    } = options;

    const questionSetEntry =
      await contentfulClient.getEntry<IQuestionSetFields>(questionSetEntryId);

    this.roomId = roomId;
    this.autoDispose = false;

    const state = new TriviaJamState();
    this.setState(state);

    playerInfo.forEach(({ userId, name }) => {
      if (hostUserId === userId) {
        state.hostPlayer = new ClubPlayer({
          name,
          connected: false,
          userId,
        });
      } else {
        const player = new TriviaJamPlayer({
          name,
          connected: false,
          score: 0,
          userId,
        });
        state.players.set(userId, player);
      }
    });

    const room = this as Room<TriviaJamState>;
    this.service = interpret(
      createTriviaJamServerMachine(room, questionSetEntry.fields.questions)
    ).start();
    this.service.subscribe((state) => {
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    this.onMessage(CONTINUE, (client) => {
      this.service.send({
        type: CONTINUE,
        userId: client.userData.userId as string,
      });
    });

    this.onMessage(
      TRIVIA_JAM_SUBMIT_RESPONSE,
      (client, event: Omit<TriviaJamSubmitResponseCommand, 'userId'>) => {
        this.service.send({
          type: TRIVIA_JAM_SUBMIT_RESPONSE,
          userId: client.userData.userId as string,
          response: event.response,
        });
      }
    );
  }

  onJoin(client: Client, options: { userId: string }) {
    const { hostPlayer, players } = this.state;
    const userId = options.userId;

    let player: ClubPlayer | undefined;
    if (userId === hostPlayer.userId) {
      player = hostPlayer;
    } else {
      player = players.get(userId);
    }

    if (!player) {
      console.warn('couldnt find player on join', userId);
      return;
    }

    player.connected = true;
    this.setState(this.state);
    this.service.send({ type: JOIN, userId });
    client.userData = { userId };
  }

  async onLeave(client: Client) {
    const { hostPlayer, players } = this.state;
    const { userId } = client.userData;
    this.service.send({ type: LEAVE, userId });

    // When player leaves, hold for 30 seconds before they disconnect
    const player =
      players.get(userId) || hostPlayer.userId === userId
        ? hostPlayer
        : undefined;
    if (!player) {
      console.warn('couldnt find player on leave', userId);
      return;
    }

    try {
      player.connected = false;
      // tood figure out biz logic here. when do we allow reconnects?
      // probably always
      await this.allowReconnection(client, 600);
      player.connected = true;
    } catch (ex) {
      // if (players.get(userId)) {
      //   this.state.players.delete(userId);
      // }
    }
  }
}
