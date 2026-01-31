import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { formatTime, formatShotClock } from '../utils/rules';

export function OBSOverlay() {
  const {
    home,
    away,
    gameTime,
    shotClock,
    period,
    rules,
    possession,
    tick,
    isRunning,
  } = useGameStore();

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const isOvertime = period > rules.periodCount;
  const periodLabel = isOvertime
    ? `OT${period - rules.periodCount}`
    : rules.periodCount === 2
    ? `H${period}`
    : `Q${period}`;

  return (
    <div className="min-h-screen bg-transparent p-4">
      {/* Compact scoreboard overlay */}
      <div className="inline-flex items-center gap-4 bg-black/80 rounded-lg p-3 text-white font-bold">
        {/* Home team */}
        <div className="flex items-center gap-2">
          {possession === 'home' && (
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
          <span
            className="text-lg uppercase"
            style={{ color: home.color }}
          >
            {home.name}
          </span>
          <span className="text-3xl font-mono" style={{ color: home.color }}>
            {home.score}
          </span>
        </div>

        {/* Center - Time and period */}
        <div className="flex flex-col items-center px-4 border-x border-gray-600">
          <div className="text-xs text-gray-400">{periodLabel}</div>
          <div className="text-2xl font-mono">{formatTime(gameTime)}</div>
          <div className="text-sm font-mono text-orange-400">
            {formatShotClock(shotClock)}
          </div>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-mono" style={{ color: away.color }}>
            {away.score}
          </span>
          <span
            className="text-lg uppercase"
            style={{ color: away.color }}
          >
            {away.name}
          </span>
          {possession === 'away' && (
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Fouls indicator (optional, shown below) */}
      <div className="inline-flex items-center gap-4 bg-black/60 rounded-lg p-2 mt-2 text-white text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Fouls:</span>
          <span style={{ color: home.color }}>{home.fouls}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: away.color }}>{away.fouls}</span>
        </div>
      </div>
    </div>
  );
}

// Alternative minimal overlay for cleaner streams
export function OBSOverlayMinimal() {
  const { home, away, gameTime, period, rules, possession } = useGameStore();

  const isOvertime = period > rules.periodCount;
  const periodLabel = isOvertime
    ? `OT${period - rules.periodCount}`
    : `Q${period}`;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="inline-flex items-center bg-black/90 text-white font-bold">
        {/* Home */}
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ backgroundColor: `${home.color}dd` }}
        >
          {possession === 'home' && <span className="text-yellow-300">◄</span>}
          <span className="text-sm uppercase">{home.name}</span>
          <span className="text-2xl font-mono">{home.score}</span>
        </div>

        {/* Time */}
        <div className="px-3 py-2 bg-gray-900 flex flex-col items-center">
          <span className="text-xs text-gray-400">{periodLabel}</span>
          <span className="text-lg font-mono">{formatTime(gameTime)}</span>
        </div>

        {/* Away */}
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ backgroundColor: `${away.color}dd` }}
        >
          <span className="text-2xl font-mono">{away.score}</span>
          <span className="text-sm uppercase">{away.name}</span>
          {possession === 'away' && <span className="text-yellow-300">►</span>}
        </div>
      </div>
    </div>
  );
}
