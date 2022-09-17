import { ActorID, ActorManager, MachineFactory } from '@explorers-club/actor';
import { Database } from '@explorers-club/database';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  PartyActor,
  PartyEvents,
} from '@explorers-club/party';
import { PresenceState } from '@supabase/realtime-js/dist/module/RealtimePresence';
import { RealtimeChannel } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import { supabaseAdmin } from './lib/supabase';

type PartyRow = Database['public']['Tables']['parties']['Row'];

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

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
        const partyActorId = getPartyActorId(joinCode);
        const actorManager = new ActorManager(channel, partyActorId);

        const handleConnect = () => {
          const actorId: ActorID = `Party-${joinCode}`;
          const partyActor = actorManager.spawn({
            actorId,
            actorType: 'PARTY_ACTOR',
          });

          initializePresence({ channel, actorManager, partyActor });
        };

        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            handleConnect();
          } else {
            console.warn(`${joinCode} Channel status - ${status}`);
          }
        });
      }
    )
    .subscribe();
}

const initializePresence = ({
  channel,
  actorManager,
  partyActor,
}: {
  channel: RealtimeChannel;
  actorManager: ActorManager;
  partyActor: PartyActor;
}) => {
  const handleSync = async () => {
    const presenceState = channel.presenceState();
    const toAdd = Object.values(presenceState).map((p) => ({
      userId: p['userId'],
    }));

    for (let i = 0; i < toAdd.length; i++) {
      partyActor.send(PartyEvents.PLAYER_CONNECTED(toAdd[i]));
    }
  };

  const handleLeave = async (payload: PresenceState[]) => {
    const toRemove = payload['leftPresences'].map((p) => ({
      userId: p['userId'],
    }));

    for (let i = 0; i < toRemove.length; i++) {
      partyActor.send(PartyEvents.PLAYER_DISCONNECTED(toRemove[i]));
    }
  };

  const handleJoin = async (payload: PresenceState[]) => {
    const toAdd = payload['newPresences'].map((p) => ({
      userId: p['userId'],
    }));

    for (let i = 0; i < toAdd.length; i++) {
      partyActor.send(PartyEvents.PLAYER_CONNECTED(toAdd[i]));
    }

    actorManager.syncAll();
  };

  channel.on('presence', { event: 'sync' }, handleSync);
  channel.on('presence', { event: 'leave' }, handleLeave);
  channel.on('presence', { event: 'join' }, handleJoin);
};

bootstrap();
