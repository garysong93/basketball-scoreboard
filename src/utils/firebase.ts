import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database, ref, set, onValue, off, get } from 'firebase/database';

// Firebase configuration - Replace with your own config from Firebase Console
// Go to: https://console.firebase.google.com/
// 1. Create a new project (or use existing)
// 2. Go to Project Settings > General > Your apps > Add app > Web
// 3. Copy the firebaseConfig object and paste below
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let database: Database | null = null;

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
}

// Initialize Firebase (only if configured)
export function initFirebase(): Database | null {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Running in local-only mode.');
    return null;
  }

  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  }

  return database;
}

// Get database instance
export function getDb(): Database | null {
  if (!database) {
    return initFirebase();
  }
  return database;
}

// Generate a unique game ID
export function generateGameId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoiding ambiguous characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Game data interface for Firebase
export interface FirebaseGameData {
  id: string;
  createdAt: number;
  updatedAt: number;
  hostId: string;
  home: {
    name: string;
    score: number;
    fouls: number;
    timeouts: number;
    color: string;
  };
  away: {
    name: string;
    score: number;
    fouls: number;
    timeouts: number;
    color: string;
  };
  gameTime: number;
  shotClock: number;
  period: number;
  possession: 'home' | 'away' | null;
  isRunning: boolean;
  rules: string; // Rule set name
}

// Create a new game in Firebase
export async function createGame(
  gameData: Omit<FirebaseGameData, 'id' | 'createdAt' | 'updatedAt'>,
  existingGameId?: string
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  const gameId = existingGameId || generateGameId();
  const now = Date.now();

  try {
    await set(ref(db, `games/${gameId}`), {
      ...gameData,
      id: gameId,
      createdAt: now,
      updatedAt: now,
    });
    return gameId;
  } catch (error) {
    console.error('Error creating game:', error);
    return null;
  }
}

// Update game data in Firebase
export async function updateGame(gameId: string, updates: Partial<FirebaseGameData>): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const gameRef = ref(db, `games/${gameId}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      console.error('Game not found:', gameId);
      return false;
    }

    await set(gameRef, {
      ...snapshot.val(),
      ...updates,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating game:', error);
    return false;
  }
}

// Subscribe to game updates
export function subscribeToGame(
  gameId: string,
  callback: (data: FirebaseGameData | null) => void
): () => void {
  const db = getDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  const gameRef = ref(db, `games/${gameId}`);

  onValue(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as FirebaseGameData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to game:', error);
    callback(null);
  });

  // Return unsubscribe function
  return () => off(gameRef);
}

// Check if game exists
export async function gameExists(gameId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const snapshot = await get(ref(db, `games/${gameId}`));
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking game:', error);
    return false;
  }
}

// Delete old games (cleanup - games older than 24 hours)
export async function cleanupOldGames(): Promise<void> {
  const db = getDb();
  if (!db) return;

  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

  try {
    const gamesRef = ref(db, 'games');
    const snapshot = await get(gamesRef);

    if (snapshot.exists()) {
      const games = snapshot.val();
      for (const gameId of Object.keys(games)) {
        if (games[gameId].updatedAt < cutoff) {
          await set(ref(db, `games/${gameId}`), null);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up games:', error);
  }
}
