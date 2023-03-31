import { apiRouter, createContext } from '@explorers-club/api';
import { environment } from './environments/environment';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import * as ws from 'ws';
const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: apiRouter, createContext });

wss.on('connection', () => {
  console.log('connect!');
  wss.once('close', () => {
    console.log('connection close');
  });
});

console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});

// const app = express();

// app.use(
//   '/api',
//   trpcExpress.createExpressMiddleware({
//     router: apiRouter,
//     createContext,
//   })
// );
// app.use(morgan());
// app.use(cors());

// const port = process.env.port || 3000;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);
