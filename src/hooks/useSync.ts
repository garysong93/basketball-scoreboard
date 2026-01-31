import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  isFirebaseConfigured,
  createGame,
  updateGame,
  subscribeToGame,
  gameExists,
  type FirebaseGameData,
} from '../utils/firebase';
import type { RefereeRole } from '../utils/refereeRoles';

export type SyncMode = 'local' | 'host' | 'viewer';
export type SyncStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseSyncReturn {
  // State
  syncMode: SyncMode;
  syncStatus: SyncStatus;
  gameId: string | null;
  isHost: boolean;
  isViewer: boolean;
  shareUrl: string | null;
  isFirebaseEnabled: boolean;
  refereeRole: RefereeRole | null;

  // Actions
  startHosting: () => Promise<string | null>;
  joinGame: (gameId: string, role?: RefereeRole) => Promise<boolean>;
  stopSync: () => void;
  copyShareLink: () => void;
  setRefereeRole: (role: RefereeRole) => void;
}

// Generate a unique host ID for this browser session
function getHostId(): string {
  let hostId = sessionStorage.getItem('scoreboard-host-id');
  if (!hostId) {
    hostId = crypto.randomUUID();
    sessionStorage.setItem('scoreboard-host-id', hostId);
  }
  return hostId;
}

export function useSync(): UseSyncReturn {
  const {
    home,
    away,
    gameTime,
    shotClock,
    period,
    possession,
    isRunning,
    rules,
  } = useGameStore();

  const [syncMode, setSyncMode] = useState<SyncMode>('local');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('disconnected');
  const [gameId, setGameId] = useState<string | null>(null);
  const [refereeRole, setRefereeRole] = useState<RefereeRole | null>(null);

  const hostId = useRef(getHostId());
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isUpdatingRef = useRef<boolean>(false);

  const isFirebaseEnabled = isFirebaseConfigured();
  const isHost = syncMode === 'host';
  const isViewer = syncMode === 'viewer';

  const shareUrl = gameId
    ? `${window.location.origin}?game=${gameId}`
    : null;

  // Sync game state to Firebase (host only)
  const syncToFirebase = useCallback(async () => {
    if (!isHost || !gameId || isUpdatingRef.current) return;

    // Throttle updates to max once per 100ms
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;

    const gameData: Partial<FirebaseGameData> = {
      home: {
        name: home.name,
        score: home.score,
        fouls: home.fouls,
        timeouts: home.timeouts,
        color: home.color,
      },
      away: {
        name: away.name,
        score: away.score,
        fouls: away.fouls,
        timeouts: away.timeouts,
        color: away.color,
      },
      gameTime,
      shotClock,
      period,
      possession,
      isRunning,
      rules: rules.name,
    };

    await updateGame(gameId, gameData);
  }, [isHost, gameId, home, away, gameTime, shotClock, period, possession, isRunning, rules]);

  // Sync to Firebase when game state changes (host only)
  useEffect(() => {
    if (isHost && gameId) {
      syncToFirebase();
    }
  }, [isHost, gameId, home.score, away.score, home.fouls, away.fouls,
      home.timeouts, away.timeouts, gameTime, shotClock, period,
      possession, isRunning, syncToFirebase]);

  // Start hosting a new game
  const startHosting = useCallback(async (): Promise<string | null> => {
    if (!isFirebaseEnabled) {
      console.log('Firebase not configured');
      return null;
    }

    setSyncStatus('connecting');

    const gameData = {
      hostId: hostId.current,
      home: {
        name: home.name,
        score: home.score,
        fouls: home.fouls,
        timeouts: home.timeouts,
        color: home.color,
      },
      away: {
        name: away.name,
        score: away.score,
        fouls: away.fouls,
        timeouts: away.timeouts,
        color: away.color,
      },
      gameTime,
      shotClock,
      period,
      possession,
      isRunning,
      rules: rules.name,
    };

    const newGameId = await createGame(gameData);

    if (newGameId) {
      setGameId(newGameId);
      setSyncMode('host');
      setSyncStatus('connected');
      return newGameId;
    } else {
      setSyncStatus('error');
      return null;
    }
  }, [isFirebaseEnabled, home, away, gameTime, shotClock, period, possession, isRunning, rules]);

  // Join an existing game as viewer or with a specific role
  const joinGame = useCallback(async (joinGameId: string, role: RefereeRole = 'viewer'): Promise<boolean> => {
    if (!isFirebaseEnabled) {
      console.log('Firebase not configured');
      return false;
    }

    setSyncStatus('connecting');

    // Check if game exists
    const exists = await gameExists(joinGameId);
    if (!exists) {
      setSyncStatus('error');
      return false;
    }

    // Subscribe to game updates
    const unsubscribe = subscribeToGame(joinGameId, (data) => {
      if (data) {
        isUpdatingRef.current = true;

        // Update local state from Firebase
        const store = useGameStore.getState();

        // Update teams
        store.setTeamName('home', data.home.name);
        store.setTeamColor('home', data.home.color);
        store.setTeamName('away', data.away.name);
        store.setTeamColor('away', data.away.color);

        // Update scores (by setting directly)
        // We need to add a method to set score directly
        // For now, we'll use a workaround

        // This is a simplified sync - in production you'd want more granular control
        useGameStore.setState({
          home: { ...store.home, ...data.home, players: store.home.players },
          away: { ...store.away, ...data.away, players: store.away.players },
          gameTime: data.gameTime,
          shotClock: data.shotClock,
          period: data.period,
          possession: data.possession,
          isRunning: data.isRunning,
        });

        setSyncStatus('connected');
        isUpdatingRef.current = false;
      } else {
        setSyncStatus('error');
      }
    });

    unsubscribeRef.current = unsubscribe;
    setGameId(joinGameId);
    setRefereeRole(role);
    setSyncMode('viewer');

    return true;
  }, [isFirebaseEnabled]);

  // Stop syncing
  const stopSync = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setSyncMode('local');
    setSyncStatus('disconnected');
    setGameId(null);
    setRefereeRole(null);
  }, []);

  // Copy share link to clipboard
  const copyShareLink = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  }, [shareUrl]);

  // Check URL for game ID on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGameId = params.get('game');

    if (urlGameId && isFirebaseEnabled) {
      joinGame(urlGameId);
    }
  }, [isFirebaseEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    syncMode,
    syncStatus,
    gameId,
    isHost,
    isViewer,
    shareUrl,
    isFirebaseEnabled,
    refereeRole,
    startHosting,
    joinGame,
    stopSync,
    copyShareLink,
    setRefereeRole,
  };
}
