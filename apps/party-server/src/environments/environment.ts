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
  supabaseURL: process.env['SUPABASE_URL'],
  supabaseServiceKey: process.env['SUPABASE_SERVICE_KEY'],
};
