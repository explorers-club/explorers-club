import {
  CONTINUE,
  JOIN,
  LEAVE,
  TriviaJamSubmitResponseCommand,
  TRIVIA_JAM_SUBMIT_RESPONSE,
} from '@explorers-club/commands';
import { contentfulClient } from '@explorers-club/contentful';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import { TriviaJamRoomId } from '@explorers-club/schema';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Client, matchMaker, Room } from 'colyseus';
import { interpret } from 'xstate';
import {
  createTriviaJamServerMachine,
  TriviaJamServerService,
} from './trivia-jam-server.machine';

const sampleQuestionSetEntryId = 'dSX6kC0PNliXTl7qHYJLH';

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
  private service: TriviaJamServerService;

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
    const { roomId, userId, playerInfo, questionSetEntryId } = options;

    const questionSetEntry =
      await contentfulClient.getEntry<IQuestionSetFields>(questionSetEntryId);

    this.roomId = roomId;
    this.autoDispose = false;

    const state = new TriviaJamState();
    state.hostUserId = userId;
    this.setState(state);

    playerInfo.forEach(({ userId, name }) => {
      const player = new TriviaJamPlayer({
        name,
        connected: false,
        score: 0,
        userId,
      });
      state.players.set(userId, player);
    });

    const room = this as Room<TriviaJamState>;
    this.service = interpret(
      createTriviaJamServerMachine(room, questionSetEntry.fields.questions)
    ).start();
    this.service.subscribe((state) => {
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    this.onMessage(CONTINUE, (_) => {
      this.service.send({ type: CONTINUE });
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

  onJoin(client: Client, options) {
    const { userId } = options;
    this.state.players.get(userId).connected = true;
    this.service.send({ type: JOIN, userId });
    client.userData = { userId };
  }

  async onLeave(client: Client) {
    const { userId } = client.userData;
    this.service.send({ type: LEAVE, userId });

    // When player leaves, hold for 30 seconds before they disconnect
    const player = this.state.players.get(client.userData.userId);
    if (!player) {
      console.warn('error finding player in onLeave');
      return;
    }
    player.connected = false;

    try {
      await this.allowReconnection(client, 30);
      player.connected = true;
    } catch (ex) {
      this.state.players.delete(userId);
    }
  }
}
