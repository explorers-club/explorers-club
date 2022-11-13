// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

const firebaseConfig = {
  apiKey: 'AIzaSyCb8N1Fi09VPX30u2X8JukJUX9apA8z7Zs',
  authDomain: 'explorers-club-staging.firebaseapp.com',
  projectId: 'explorers-club-staging',
  storageBucket: 'explorers-club-staging.appspot.com',
  messagingSenderId: '115019364533',
  appId: '1:115019364533:web:17432a5ea8b5c8c0c366fc',
  databaseURL: 'https://explorers-club-staging-default-rtdb.firebaseio.com',
};

export const environment = {
  firebaseConfig,
  production: false,
  supabaseUrl: 'http://explorers-club.local:54321',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs',
};
