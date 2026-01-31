export type RuleSet = 'fiba' | 'nba' | 'ncaa' | '3x3' | 'custom';

export interface GameRules {
  name: RuleSet;
  periodCount: number;
  periodLength: number; // in seconds
  shotClock: number; // in seconds
  shotClockReset: number; // reset value after offensive rebound
  teamFoulsPerPeriod: number; // fouls before bonus
  bonusFouls: number; // fouls for bonus (usually same as teamFoulsPerPeriod)
  doubleBonusFouls: number; // fouls for double bonus (0 means no double bonus)
  maxTimeoutsPerHalf: number;
  overtimeLength: number; // in seconds
  overtimeTimeouts: number;
  winByScore?: number; // for 3x3, win by reaching this score
}

export const RULE_PRESETS: Record<RuleSet, GameRules> = {
  fiba: {
    name: 'fiba',
    periodCount: 4,
    periodLength: 10 * 60, // 10 minutes
    shotClock: 24,
    shotClockReset: 14,
    teamFoulsPerPeriod: 4,
    bonusFouls: 5,
    doubleBonusFouls: 0, // FIBA doesn't have double bonus
    maxTimeoutsPerHalf: 2,
    overtimeLength: 5 * 60,
    overtimeTimeouts: 1,
  },
  nba: {
    name: 'nba',
    periodCount: 4,
    periodLength: 12 * 60, // 12 minutes
    shotClock: 24,
    shotClockReset: 14,
    teamFoulsPerPeriod: 4,
    bonusFouls: 5,
    doubleBonusFouls: 0, // NBA uses penalty after 5th foul
    maxTimeoutsPerHalf: 4, // 7 total, simplified to 4 per half
    overtimeLength: 5 * 60,
    overtimeTimeouts: 2,
  },
  ncaa: {
    name: 'ncaa',
    periodCount: 2,
    periodLength: 20 * 60, // 20 minutes
    shotClock: 30,
    shotClockReset: 20,
    teamFoulsPerPeriod: 6, // per half
    bonusFouls: 7,
    doubleBonusFouls: 10,
    maxTimeoutsPerHalf: 4,
    overtimeLength: 5 * 60,
    overtimeTimeouts: 1,
  },
  '3x3': {
    name: '3x3',
    periodCount: 1,
    periodLength: 10 * 60, // 10 minutes
    shotClock: 12,
    shotClockReset: 12,
    teamFoulsPerPeriod: 6,
    bonusFouls: 7,
    doubleBonusFouls: 10,
    maxTimeoutsPerHalf: 1,
    overtimeLength: 0, // sudden death overtime
    overtimeTimeouts: 0,
    winByScore: 21,
  },
  custom: {
    name: 'custom',
    periodCount: 4,
    periodLength: 12 * 60,
    shotClock: 24,
    shotClockReset: 14,
    teamFoulsPerPeriod: 5,
    bonusFouls: 5,
    doubleBonusFouls: 0,
    maxTimeoutsPerHalf: 3,
    overtimeLength: 5 * 60,
    overtimeTimeouts: 1,
  },
};

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatShotClock(seconds: number): string {
  return seconds.toString().padStart(2, '0');
}
