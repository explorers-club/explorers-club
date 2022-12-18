import { Room, Client, matchMaker } from 'colyseus';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamRoomId } from '@explorers-club/schema';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';

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
}

export class TriviaJamRoom extends Room<TriviaJamState> {
  static async create({ roomId, clubRoom }: CreateProps) {
    const hostUserId = clubRoom.state.hostUserId.valueOf();

    const playerInfo: PlayerInfo[] = Array.from(
      clubRoom.state.players.entries()
    ).map(([userId, player]) => {
      return { userId, name: player.name.valueOf() };
    });

    return await matchMaker.createRoom('trivia_jam', {
      roomId,
      userId: hostUserId,
      playerInfo,
    });
  }

  onCreate(options: OnCreateOptions) {
    const { roomId, userId, playerInfo } = options;

    this.roomId = roomId;
    this.autoDispose = false;

    const state = new TriviaJamState();
    state.hostUserId = userId;
    playerInfo.forEach(({ userId, name }) => {
      const player = new TriviaJamPlayer({
        name,
        connected: false,
      });
      state.players.set(userId, player);
    });
    this.setState(state);
  }

  onJoin(client: Client, options) {
    const { userId } = options;
    // console.log(
    //   client.sessionId,
    //   'joined!',
    //   this.roomId,
    //   this.roomName,
    //   options
    // );
    console.log(userId, 'setting connected true');
    const player = this.state.players.get(userId);
    if (player) {
      this.state.players.get(userId).connected = true;
    } else {
      console.warn('unknown user connected', userId);
    }
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!', this.roomId, this.roomName);
  }
}
