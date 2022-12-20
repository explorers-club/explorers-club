import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { LobbyRoom, Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';

import { ClubRoom } from './rooms/ClubRoom';
import { DiffusionaryRoom } from './rooms/DiffusionaryRoom';
import { TriviaJamRoom } from '@explorers-club/trivia-jam/server';
import { monitor } from '@colyseus/monitor';

const app = express();
const port = Number(process.env.PORT || 2567);

app.use(cors());
app.use(express.json());
app.use('/colyseus', monitor());

const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({ server: server }),
});

gameServer.define('lobby', LobbyRoom);
gameServer.define('club', ClubRoom).enableRealtimeListing();
gameServer.define('trivia_jam', TriviaJamRoom).enableRealtimeListing();
gameServer.define('diffusionary', DiffusionaryRoom).enableRealtimeListing();
gameServer.listen(port);

console.log(`Listening on ws://localhost:${port}`);
