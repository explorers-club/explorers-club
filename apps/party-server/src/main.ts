import { Database } from '@explorers-club/database';
import {
  CURRENT_STATE_EVENT,
  PartyEvents,
  partyMachine
} from '@explorers-club/party';
import { PresenceState } from '@supabase/realtime-js/dist/module/RealtimePresence';
import * as crypto from 'crypto';
import { interpret } from 'xstate';
import { supabaseAdmin } from './lib/supabase';

type PartyRow = Database['public']['Tables']['parties']['Row'];

async function bootstrap() {
  const hostId = crypto.randomUUID();
  console.log('Listener for new parties on host ' + hostId);

  supabaseAdmin
    .channel('db-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'parties' },
      async (payload: { new: PartyRow }) => {
        const joinCode = payload.new.join_code;
        const channel = supabaseAdmin.channel(`party-${joinCode}`);
        const partyActor = interpret(partyMachine);
        partyActor.start();

        channel
          .on('presence', { event: 'join' }, async (payload: PresenceState) => {
            const toAdd = payload['newPresences'].map((p) => ({
              userId: p['userId'],
            }));

            for (let i = 0; i < toAdd.length; i++) {
              partyActor.send(PartyEvents.PLAYER_CONNECTED(toAdd[i]));
            }
            const currentState = partyActor.getSnapshot();

            // Broadcast current state anytime someone joins
            await channel.send(
              CURRENT_STATE_EVENT({
                state: JSON.parse(JSON.stringify(currentState)),
              })
            );
          })
          .on('presence', { event: 'leave' }, (payload: PresenceState) => {
            const toRemove = payload['leftPresences'].map((p) => ({
              userId: p['userId'],
            }));

            for (let i = 0; i < toRemove.length; i++) {
              partyActor.send(PartyEvents.PLAYER_DISCONNECTED(toRemove[i]));
            }
          })
          .on('broadcast', { event: 'actorEvent' }, (payload) => {
            // TODO
            // The idea here is that we find the actor and
            // then send the event payload to it here...
            console.log(payload);
          })
          // .on('broadcast', { event: 'connect' }, (payload: PresenceState) => {})
          .subscribe(async (status) => {
            if (status !== 'SUBSCRIBED') {
              console.warn(`Channel status ${status} - ${joinCode}`);
            } else {
              console.log(`Connected to channel ${joinCode}`);
            }
          });
      }
    )
    .subscribe();
}

bootstrap();
