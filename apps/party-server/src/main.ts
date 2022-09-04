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
    .channel('public:parties')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'parties' },
      (payload: unknown) => {
        console.log('new party', payload);
      }
    )
    .subscribe();
}

bootstrap();
