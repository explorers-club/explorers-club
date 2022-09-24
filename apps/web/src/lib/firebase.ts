import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments/environment';

// Initialize Firebase
initializeApp(environment.firebaseConfig);

export const db = getDatabase();
