import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';
import { LobbyRoom } from 'colyseus';
import { DiffusionaryRoom } from './rooms/DiffusionaryRoom';
import { ClubRoom } from './rooms/ClubRoom';
import { TriviaJamRoom } from './rooms/TriviaJamRoom';

export default Arena({
  getId: () => 'Explorers Club',

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('lobby', LobbyRoom);
    gameServer.define('club', ClubRoom).enableRealtimeListing();
    gameServer.define('trivia_jam', TriviaJamRoom).enableRealtimeListing();
    gameServer.define('diffusionary', DiffusionaryRoom).enableRealtimeListing();
  },

  initializeExpress: (app) => {
    // /**
    //  * Bind your custom express routes here:
    //  */
    // app.get('/', (req, res) => {
    //   res.send("It's time to kick ass and chew bubblegum!");
    // });

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use('/colyseus', monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
