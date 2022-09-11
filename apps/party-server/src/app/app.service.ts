// import { createPartyHostMachine } from '@explorers-club/party';
import { Injectable } from '@nestjs/common';
import { interpret } from 'xstate';
import { supabaseAdmin } from '../lib/supabase';

@Injectable()
export class AppService {
  // private readonly partyActors: Map<string, ServerPartyActor> = new Map();

  run({ partyId }: { partyId: string }): void {
    // const machine = createPartyServerMachine(
    //   { id: partyId, playerIds: [] },
    //   supabaseAdmin
    // );
    // const actor = interpret(machine);
    // console.log('Spawning actor', actor.id);
    // actor.start();
    // this.partyActors.set(partyId, actor);
  }

  stop({ partyId }: { partyId: string }): void {
    // const actor = this.partyActors.get(partyId);
    // if (actor) {
    //   console.log('Stopping actor', actor.id);
    //   actor.stop();
    // } else {
    //   console.warn('tried to stop a non running actor');
    // }
  }
}
