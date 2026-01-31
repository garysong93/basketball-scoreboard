import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RULE_PRESETS, type GameRules, type RuleSet } from '../utils/rules';
import type { Language } from '../i18n';

export type Team = 'home' | 'away';

export interface PlayerStats {
  id: string;
  name: string;
  number: string;
  points: number;
  fouls: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutesPlayed: number;
  isOnCourt: boolean;
}

export interface TeamState {
  name: string;
  score: number;
  fouls: number;
  timeouts: number;
  players: PlayerStats[];
  color: string;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  gameTime: number;
  period: number;
  type: 'score' | 'foul' | 'timeout' | 'period_start' | 'period_end' | 'substitution' | 'assist' | 'rebound' | 'steal' | 'block' | 'turnover';
  team?: Team;
  playerId?: string;
  value?: number;
  description: string;
}

export interface GameState {
  // Game settings
  rules: GameRules;
  language: Language;
  theme: 'dark' | 'light';

  // Game state
  isRunning: boolean;
  gameTime: number; // in seconds
  shotClock: number;
  period: number;
  possession: Team | null;

  // Teams
  home: TeamState;
  away: TeamState;

  // History
  events: GameEvent[];
  canUndo: boolean;
  canRedo: boolean;

  // UI state
  isFullscreen: boolean;
  showPlayerStats: boolean;
  selectedTeam: Team | null;
  animatingScore: Team | null;
}

interface GameActions {
  // Score actions
  addScore: (team: Team, points: number, playerId?: string) => void;
  subtractScore: (team: Team, points: number) => void;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetGameTime: () => void;
  resetShotClock: (fullReset?: boolean) => void;
  tick: () => void;

  // Period actions
  nextPeriod: () => void;
  setPeriod: (period: number) => void;

  // Foul actions
  addFoul: (team: Team, playerId?: string) => void;
  resetFouls: () => void;

  // Timeout actions
  callTimeout: (team: Team) => void;

  // Possession actions
  setPossession: (team: Team | null) => void;
  togglePossession: () => void;

  // Player actions
  addPlayer: (team: Team, name: string, number: string) => void;
  removePlayer: (team: Team, playerId: string) => void;
  updatePlayerStats: (team: Team, playerId: string, stats: Partial<PlayerStats>) => void;
  togglePlayerOnCourt: (team: Team, playerId: string) => void;
  recordPlayerStat: (team: Team, playerId: string, statType: 'assist' | 'rebound' | 'steal' | 'block' | 'turnover', delta: number) => void;

  // Team actions
  setTeamName: (team: Team, name: string) => void;
  setTeamColor: (team: Team, color: string) => void;

  // Settings actions
  setRules: (ruleSet: RuleSet) => void;
  setCustomRules: (rules: Partial<GameRules>) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Game management
  newGame: () => void;
  endGame: () => void;

  // UI actions
  setFullscreen: (isFullscreen: boolean) => void;
  setShowPlayerStats: (show: boolean) => void;
  setSelectedTeam: (team: Team | null) => void;
  clearAnimatingScore: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
}

const createInitialTeamState = (name: string, color: string): TeamState => ({
  name,
  score: 0,
  fouls: 0,
  timeouts: 0,
  players: [],
  color,
});

const createDefaultPlayers = (): PlayerStats[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Player ${i + 1}`,
    number: String(i + 1),
    points: 0,
    fouls: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    minutesPlayed: 0,
    isOnCourt: true,
  }));
};

const initialState: GameState = {
  rules: RULE_PRESETS.fiba,
  language: 'en',
  theme: 'light',
  isRunning: false,
  gameTime: RULE_PRESETS.fiba.periodLength,
  shotClock: RULE_PRESETS.fiba.shotClock,
  period: 1,
  possession: null,
  home: {
    ...createInitialTeamState('HOME', '#e63946'),
    players: createDefaultPlayers(),
  },
  away: {
    ...createInitialTeamState('AWAY', '#457b9d'),
    players: createDefaultPlayers(),
  },
  events: [],
  canUndo: false,
  canRedo: false,
  isFullscreen: false,
  showPlayerStats: false,
  selectedTeam: null,
  animatingScore: null,
};

// History management
let history: GameState[] = [];
let historyIndex = -1;

const saveToHistory = (state: GameState) => {
  // Remove any redo states
  history = history.slice(0, historyIndex + 1);
  // Add current state
  history.push(JSON.parse(JSON.stringify(state)));
  historyIndex = history.length - 1;
  // Limit history size
  if (history.length > 100) {
    history.shift();
    historyIndex--;
  }
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Score actions
      addScore: (team, points, playerId) => {
        const state = get();
        saveToHistory(state);

        // Find player name if playerId is provided
        const teamState = state[team];
        const player = playerId ? teamState.players.find(p => p.id === playerId) : null;

        // Create description with player info if available
        let description: string;
        if (player) {
          description = `#${player.number} ${player.name} +${points}`;
        } else {
          description = `${teamState.name} +${points}`;
        }

        set({
          [team]: {
            ...state[team],
            score: state[team].score + points,
          },
          animatingScore: team,
          canUndo: true,
          canRedo: false,
          events: [
            ...state.events,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              gameTime: state.gameTime,
              period: state.period,
              type: 'score',
              team,
              playerId,
              value: points,
              description,
            },
          ],
        });
        // Clear animation after delay
        setTimeout(() => get().clearAnimatingScore(), 300);
      },

      subtractScore: (team, points) => {
        const state = get();
        const newScore = Math.max(0, state[team].score - points);
        saveToHistory(state);
        set({
          [team]: {
            ...state[team],
            score: newScore,
          },
          canUndo: true,
          canRedo: false,
        });
      },

      // Timer actions
      startTimer: () => set({ isRunning: true }),

      pauseTimer: () => set({ isRunning: false }),

      resetGameTime: () => {
        const state = get();
        set({
          gameTime: state.rules.periodLength,
          isRunning: false,
        });
      },

      resetShotClock: (fullReset = true) => {
        const state = get();
        set({
          shotClock: fullReset ? state.rules.shotClock : state.rules.shotClockReset,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning) return;

        let newGameTime = state.gameTime;
        let newShotClock = state.shotClock;
        let shouldStop = false;

        // Decrement shot clock
        if (newShotClock > 0) {
          newShotClock--;
        }

        // Decrement game time
        if (newGameTime > 0) {
          newGameTime--;
        } else {
          shouldStop = true;
        }

        set({
          gameTime: newGameTime,
          shotClock: newShotClock,
          isRunning: !shouldStop,
        });
      },

      // Period actions
      nextPeriod: () => {
        const state = get();
        const newPeriod = state.period + 1;
        const isOvertime = newPeriod > state.rules.periodCount;

        saveToHistory(state);
        set({
          period: newPeriod,
          gameTime: isOvertime ? state.rules.overtimeLength : state.rules.periodLength,
          shotClock: state.rules.shotClock,
          isRunning: false,
          home: { ...state.home, fouls: 0 },
          away: { ...state.away, fouls: 0 },
          canUndo: true,
          canRedo: false,
          events: [
            ...state.events,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              gameTime: 0,
              period: newPeriod,
              type: 'period_start',
              description: isOvertime ? `Overtime ${newPeriod - state.rules.periodCount}` : `Period ${newPeriod}`,
            },
          ],
        });
      },

      setPeriod: (period) => set({ period }),

      // Foul actions
      addFoul: (team, playerId) => {
        const state = get();
        saveToHistory(state);

        // Find player name if playerId is provided
        const teamState = state[team];
        const player = playerId ? teamState.players.find(p => p.id === playerId) : null;

        // Create description with player info if available
        let description: string;
        if (player) {
          description = `#${player.number} ${player.name} foul (${player.fouls + 1})`;
        } else {
          description = `${teamState.name} foul`;
        }

        const updatedTeam = {
          ...state[team],
          fouls: state[team].fouls + 1,
          players: playerId
            ? state[team].players.map((p) =>
                p.id === playerId ? { ...p, fouls: p.fouls + 1 } : p
              )
            : state[team].players,
        };

        set({
          [team]: updatedTeam,
          canUndo: true,
          canRedo: false,
          events: [
            ...state.events,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              gameTime: state.gameTime,
              period: state.period,
              type: 'foul',
              team,
              playerId,
              description,
            },
          ],
        });
      },

      resetFouls: () => {
        const state = get();
        set({
          home: { ...state.home, fouls: 0 },
          away: { ...state.away, fouls: 0 },
        });
      },

      // Timeout actions
      callTimeout: (team) => {
        const state = get();
        const maxTimeouts = state.rules.maxTimeoutsPerHalf;
        if (state[team].timeouts >= maxTimeouts) return;

        saveToHistory(state);
        set({
          [team]: {
            ...state[team],
            timeouts: state[team].timeouts + 1,
          },
          isRunning: false,
          canUndo: true,
          canRedo: false,
          events: [
            ...state.events,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              gameTime: state.gameTime,
              period: state.period,
              type: 'timeout',
              team,
              description: `${team === 'home' ? state.home.name : state.away.name} timeout`,
            },
          ],
        });
      },

      // Possession actions
      setPossession: (team) => set({ possession: team }),

      togglePossession: () => {
        const state = get();
        set({
          possession: state.possession === 'home' ? 'away' : state.possession === 'away' ? 'home' : 'home',
        });
      },

      // Player actions
      addPlayer: (team, name, number) => {
        const state = get();
        const newPlayer: PlayerStats = {
          id: crypto.randomUUID(),
          name,
          number,
          points: 0,
          fouls: 0,
          assists: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          minutesPlayed: 0,
          isOnCourt: false,
        };
        set({
          [team]: {
            ...state[team],
            players: [...state[team].players, newPlayer],
          },
        });
      },

      removePlayer: (team, playerId) => {
        const state = get();
        set({
          [team]: {
            ...state[team],
            players: state[team].players.filter((p) => p.id !== playerId),
          },
        });
      },

      updatePlayerStats: (team, playerId, stats) => {
        const state = get();
        set({
          [team]: {
            ...state[team],
            players: state[team].players.map((p) =>
              p.id === playerId ? { ...p, ...stats } : p
            ),
          },
        });
      },

      togglePlayerOnCourt: (team, playerId) => {
        const state = get();
        set({
          [team]: {
            ...state[team],
            players: state[team].players.map((p) =>
              p.id === playerId ? { ...p, isOnCourt: !p.isOnCourt } : p
            ),
          },
        });
      },

      recordPlayerStat: (team, playerId, statType, delta) => {
        const state = get();
        const player = state[team].players.find(p => p.id === playerId);
        if (!player || delta <= 0) return;

        // Map stat type to player stat property
        const statMap: Record<string, keyof PlayerStats> = {
          assist: 'assists',
          rebound: 'rebounds',
          steal: 'steals',
          block: 'blocks',
          turnover: 'turnovers',
        };

        const statProp = statMap[statType];
        if (!statProp) return;

        // Get stat names for description
        const statNames: Record<string, { en: string; zh: string }> = {
          assist: { en: 'AST', zh: '助攻' },
          rebound: { en: 'REB', zh: '篮板' },
          steal: { en: 'STL', zh: '抢断' },
          block: { en: 'BLK', zh: '盖帽' },
          turnover: { en: 'TO', zh: '失误' },
        };

        const statName = statNames[statType]?.en || statType;
        const newValue = (player[statProp] as number) + delta;

        // Update player stat
        set({
          [team]: {
            ...state[team],
            players: state[team].players.map((p) =>
              p.id === playerId ? { ...p, [statProp]: newValue } : p
            ),
          },
          events: [
            ...state.events,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              gameTime: state.gameTime,
              period: state.period,
              type: statType,
              team,
              playerId,
              value: delta,
              description: `#${player.number} ${player.name} ${statName}`,
            },
          ],
        });
      },

      // Team actions
      setTeamName: (team, name) => {
        const state = get();
        set({
          [team]: { ...state[team], name },
        });
      },

      setTeamColor: (team, color) => {
        const state = get();
        set({
          [team]: { ...state[team], color },
        });
      },

      // Settings actions
      setRules: (ruleSet) => {
        const rules = RULE_PRESETS[ruleSet];
        set({
          rules,
          gameTime: rules.periodLength,
          shotClock: rules.shotClock,
        });
      },

      setCustomRules: (customRules) => {
        const state = get();
        const rules = { ...state.rules, ...customRules, name: 'custom' as RuleSet };
        set({ rules });
      },

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),

      // Game management
      newGame: () => {
        history = [];
        historyIndex = -1;
        const state = get();
        set({
          ...initialState,
          rules: state.rules,
          language: state.language,
          theme: state.theme,
          gameTime: state.rules.periodLength,
          shotClock: state.rules.shotClock,
          home: {
            ...createInitialTeamState(state.home.name, state.home.color),
            players: createDefaultPlayers(),
          },
          away: {
            ...createInitialTeamState(state.away.name, state.away.color),
            players: createDefaultPlayers(),
          },
        });
      },

      endGame: () => {
        set({ isRunning: false });
      },

      // UI actions
      setFullscreen: (isFullscreen) => set({ isFullscreen }),

      setShowPlayerStats: (show) => set({ showPlayerStats: show }),

      setSelectedTeam: (team) => set({ selectedTeam: team }),

      clearAnimatingScore: () => set({ animatingScore: null }),

      // History actions
      undo: () => {
        if (historyIndex <= 0) return;
        historyIndex--;
        const previousState = history[historyIndex];
        set({
          ...previousState,
          canUndo: historyIndex > 0,
          canRedo: true,
        });
      },

      redo: () => {
        if (historyIndex >= history.length - 1) return;
        historyIndex++;
        const nextState = history[historyIndex];
        set({
          ...nextState,
          canUndo: true,
          canRedo: historyIndex < history.length - 1,
        });
      },
    }),
    {
      name: 'basketball-scoreboard-storage',
      partialize: (state) => ({
        rules: state.rules,
        language: state.language,
        theme: state.theme,
        home: state.home,
        away: state.away,
        gameTime: state.gameTime,
        shotClock: state.shotClock,
        period: state.period,
        events: state.events,
      }),
    }
  )
);
