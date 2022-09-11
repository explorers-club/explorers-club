// import { createPartyPlayerMachine } from '@explorers-club/party';
import { CurrentStateEvent } from '@explorers-club/party';
import { ActorRefFrom, ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

const partyConnectionModel = createModel(
  {
    joinCode: null as string | null,
  },
  {
    events: {
      CONNECT: (joinCode: string) => ({ joinCode }),
      DISCONNECT: () => ({}),
      RECONNECT: () => ({}),
      RETRY: () => ({}),
    },
  }
);
export const PARTY_CONNECTION_EVENTS = partyConnectionModel.events;

export type PartyConnectionContext = ContextFrom<typeof partyConnectionModel>;

export const createPartyConnectionMachine = () => {
  return partyConnectionModel.createMachine({
    id: 'ClientPartyMachine',
    initial: 'Uninitialized',
    context: partyConnectionModel.initialContext,
    states: {
      Uninitialized: {
        on: {
          CONNECT: {
            target: 'Connecting',
            actions: partyConnectionModel.assign({
              joinCode: (context, event) => event.joinCode,
            }),
          },
        },
      },
      Connecting: {
        invoke: {
          id: 'connectToParty',
          src: ({ joinCode }) => {
            if (!joinCode) {
              throw new Error('tried to connect to party without join code');
            }
            return connectToParty(joinCode);
          },
          onDone: 'Connected',
          onError: 'Error',
        },
      },
      Connected: {
        on: {
          DISCONNECT: 'Disconnected',
        },
      },
      Error: {
        on: {
          RETRY: 'Connecting',
        },
      },
      Disconnected: {
        on: {
          RECONNECT: 'Connecting',
        },
      },
    },
  });
};

/**
 * Main function for setting up the supabase <-> xstate/actor communication.
 *
 * Works as follows
 * 1. Connects to the supabase channel party-${joinCode}.
 * 2. Grabs the initial state of all actors in the channel
 *    and runs xstate `interpret` to "run" them.
 * 3. Sets the initial state of the connecting player actor in the channel.
 * 4. Sets up handlers to process new incoming events on actors as they come in
 *
 * When all this is done, we return from the function.
 *
 * @param joinCode
 * @returns
 */
const connectToParty = async (joinCode: string) => {
  // TODO NEXT:
  // 1.Use `spawn` here somehow to create instances of the new player
  // 2.Use an observable in xstate for triggering events
  //  Try to do this in modeling as much as possible versus writing code sequences

  const user = (await supabaseClient.auth.getUser()).data.user;
  if (!user) {
    throw new Error('trying to connect to party without user');
  }

  // createPartyPlayerMachine({ userId: user.id });

  const channel = supabaseClient.channel(`party-${joinCode}`, {
    config: {
      broadcast: { ack: true },
    },
  });

  return new Promise((resolve, reject) =>
    channel
      // .on('presence', { event: 'sync' }, () => {
      //   // const connectionList = Object.values(channel.presenceState());
      //   // const actors = connectionList.map((presence) => presence[0]);
      //   // console.log('sync', { actors });
      // })
      // .on('presence', { event: 'join' }, (payload: PresenceState) => {
      //   // const idsToAdd = payload['newPresences'].map((p) => ({
      //   //   actorId: p['actorId'],
      //   //   actorType: p['actorType'] as string,
      //   // }));
      //   // console.log({ idsToAdd });
      // })
      // .on('presence', { event: 'leave' }, (payload: PresenceState) => {
      //   // const idsToRemove = payload['leftPresences'].map((p) => ({
      //   //   actorId: p['actorId'],
      //   //   actorType: p['actorType'] as string,
      //   // }));
      //   // console.log({ idsToRemove });
      // })
      .on(
        'broadcast',
        { event: 'currentState' },
        ({ payload }: CurrentStateEvent) => {
          console.log('broadcast', payload);
        }
      )
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
          });
          resolve(channel);
        } else {
          reject();
        }
      })
  );

  return 'todo!';
};

type PartyConnectionMachine = ReturnType<typeof createPartyConnectionMachine>;
export type PartyConnectionActor = ActorRefFrom<PartyConnectionMachine>;
