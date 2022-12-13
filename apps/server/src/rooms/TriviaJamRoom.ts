import { Room, Client } from 'colyseus';
import { TriviaJamRoomState } from './schema/TriviaJamRoomState';

export class TriviaJamRoom extends Room<TriviaJamRoomState> {
  onCreate(options: any) {
    this.setState(new TriviaJamRoomState());

    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client) {
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
