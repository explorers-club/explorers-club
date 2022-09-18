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
        const channel = supabaseAdmin.channel(`party-${joinCode}`, {
          eventsPerSecondLimit: 10000 /** effectively infinite */,
        });
        const partyActorId = getPartyActorId(joinCode);
        const actorManager = new ActorManager(channel, partyActorId);

        const handleConnect = () => {
          const actorId: ActorID = getPartyActorId(joinCode);
          const partyActor = actorManager.spawn({
            actorId,
            actorType: 'PARTY_ACTOR',
          });

          initializePresence({ channel, actorManager, partyActor });
        };

        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // set a prop on presence to show host is connected?
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
    Object.values(presenceState)
      .filter((value) => !!value['userId'])
      .map((p) => ({ userId: p['userId'] as string }))
      .forEach((props) => {
        partyActor.send(PartyEvents.PLAYER_CONNECTED(props));
      });
  };

  const handleLeave = async (payload: PresenceState[]) => {
    Object.values(payload['leftPresences'])
      .filter((value) => !!value['userId'])
      .map((p) => ({ userId: p['userId'] as string }))
      .forEach((props) => {
        partyActor.send(PartyEvents.PLAYER_DISCONNECTED(props));
      });
  };

  const handleJoin = async (payload: PresenceState[]) => {
    Object.values(payload['newPresences'])
      .filter((value) => !!value['userId'])
      .map((p) => ({ userId: p['userId'] as string }))
      .forEach((props) => {
        partyActor.send(PartyEvents.PLAYER_CONNECTED(props));
      });

    // Hack to get around not being able to disable rate limiting
    setTimeout(async () => {
      const resp = await actorManager.syncAll();
      if (resp !== 'ok') {
        console.warn('error syncing');
      }
    }, 100);
  };

  channel.on('presence', { event: 'sync' }, handleSync);
  channel.on('presence', { event: 'leave' }, handleLeave);
  channel.on('presence', { event: 'join' }, handleJoin);
};

bootstrap();
