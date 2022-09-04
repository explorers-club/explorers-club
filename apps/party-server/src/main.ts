/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Database } from '@explorers-club/database';
import { supabaseAdmin } from './lib/supabase';
import { createPartyServerMachine } from '@explorers-club/party';
import { interpret } from 'xstate';

type PartyRow = Database['public']['Tables']['parties']['Row'];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // const appService = app.get(AppService);

  supabaseAdmin
    .channel('public:parties')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'parties' },
      (payload: { record: PartyRow }) => {
        // What to do from here?

        const partyMachine = createPartyServerMachine({
          id: payload.record.id,
          playerIds: [],
        });
        const partyActor = interpret(partyMachine);
        partyActor.start();
      }
    )
    .subscribe();
}

bootstrap();
