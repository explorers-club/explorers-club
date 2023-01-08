import { apiRouter, createContext } from '@explorers-club/api';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';

const app = express();

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext,
  })
);
app.use(morgan());
app.use(cors());

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
