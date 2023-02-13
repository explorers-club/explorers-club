import { ClubRoomCommand, GAME_LIST } from '@explorers-club/room';
import { ClubMetadata } from '@explorers-club/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubRoomServerEvent } from '@explorers-club/room';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { Client, Room } from 'colyseus';
import { interpret } from 'xstate';
import {
  ClubServerService,
  createClubServerMachine,
} from './club-room-server.machine';

const DEFAULT_GAME = GAME_LIST[0];

export class ClubRoom extends Room<ClubState> {
  private service!: ClubServerService;

  async onCreate(options) {
    const { roomId, userId } = options;

    this.roomId = roomId;
    this.autoDispose = false;

    const clubName = this.roomId.replace('club-', '');

    // Metadata used for fetching room listings
    const metadata: ClubMetadata = {
      clubName,
    };
    this.setMetadata(metadata);

    const hostPlayer = new ClubPlayer();
    hostPlayer.name = clubName;
    hostPlayer.userId = userId;
    hostPlayer.slotNumber = 1;
    hostPlayer.connected = true;

    const state = new ClubState();
    state.hostUserId = userId;
    state.selectedGame = DEFAULT_GAME;
    state.players.set(userId, hostPlayer);
    state.clubName = clubName;
    this.setState(state);

    const room = this as Room<ClubState>;
    this.service = interpret(createClubServerMachine(room)).start();
    this.service.subscribe((state) => {
      console.log(state.value, state.event);
      room.state.currentStates.clear();
      state.toStrings().forEach((state) => room.state.currentStates.add(state));
    });

    let tick = 0;
    const messageQueue: ClubRoomServerEvent[] = [];
    setInterval(() => {
      messageQueue.forEach((message) => {
        this.service.send(message);
      });
      tick = tick + 1;
      messageQueue.length = 0;
    }, 1000 / 60);

    this.onMessage('*', (client, _, message: ClubRoomCommand) => {
      const ts = tick + (messageQueue.length + 1) / 1000;
      messageQueue.push({
        ...message,
        ts,
        userId: client.userData.userId as string,
      });
    });

    //   // Make a reservation for everybody currently connected
    //   const reservations = await Promise.all(
    //     this.clients.map(
    //       async () => await matchMaker.reserveSeatFor(gameRoom, {})
    //     )
    //   );

    //   this.clients.forEach((client, index) => {
    //     client.send('RESERVED_GAME_SEAT', reservations[index]);
    //   });
  }

  onJoin(client: Client, options) {
    const userId = options.userId;
    client.userData = { userId };
    this.service.send({ type: 'JOIN', ts: 0, userId });
  }

  async onLeave(client: Client) {
    const { userId } = client.userData;
    this.service.send({ type: 'DISCONNECT', ts: 0, userId });

    try {
      await this.allowReconnection(client, 30);
      this.service.send({ type: 'RECONNECT', ts: 0, userId });
    } catch (ex) {
      this.service.send({ type: 'LEAVE', ts: 0, userId });
    }
  }

  onDispose() {
    console.log('disposing', this.roomId);
  }
}
