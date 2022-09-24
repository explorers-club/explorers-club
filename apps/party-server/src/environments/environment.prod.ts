const firebaseConfig = {
  apiKey: 'AIzaSyDnttWUDZiU0AxU3SoKNdpDIKUboOstE1s',
  authDomain: 'explorers-club-prod.firebaseapp.com',
  projectId: 'explorers-club-prod',
  storageBucket: 'explorers-club-prod.appspot.com',
  messagingSenderId: '134145699896',
  appId: '1:134145699896:web:14f6f5cb6db56b510d36cd',
  measurementId: 'G-DT463ZG0FQ',
  databaseURL: 'https://explorers-club-prod-default-rtdb.firebaseio.com',
};

export const environment = {
  firebaseConfig,
  production: true,
  supabaseURL: process.env['SUPABASE_URL'],
  supabseServiceKey: process.env['SUPABASE_SERVICE_KEY'],
};
