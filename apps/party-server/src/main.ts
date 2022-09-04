/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { supabaseAdmin } from './lib/supabase';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // const appService = app.get(AppService);

  console.log('Listening for new parties');
  supabaseAdmin
    .channel('db-changes')
    .on('postgres_changes', { event: '*', schema: '*' }, (payload) => {
      console.log('NEW EVENT!', payload);
      // appService.run({ partyId: 'foo' });
      // appService.stop({ partyId: 'foo' });
    })
    .subscribe();
}

bootstrap();
