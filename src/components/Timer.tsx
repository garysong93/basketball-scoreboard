import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { formatTime, formatShotClock } from '../utils/rules';
import { translations } from '../i18n';

export function Timer() {
  const {
    gameTime,
    shotClock,
    isRunning,
    period,
    rules,
    language,
    startTimer,
    pauseTimer,
    resetGameTime,
    resetShotClock,
    tick,
    nextPeriod,
  } = useGameStore();

  const t = translations[language];

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const handleToggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isRunning, startTimer, pauseTimer]);

  const isLowTime = gameTime <= 60;
  const isShotClockLow = shotClock <= 5 && shotClock > 0;
  const isOvertime = period > rules.periodCount;

  const getPeriodLabel = () => {
    if (isOvertime) {
      return `${t.overtime} ${period - rules.periodCount}`;
    }
    if (rules.periodCount === 2) {
      return `${t.half} ${period}`;
    }
    return `${t.quarter}${period}`;
  };

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      {/* Period indicator */}
      <div className="text-sm sm:text-base md:text-lg font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
        {getPeriodLabel()}
      </div>

      {/* Main game time */}
      <div
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-mono font-bold tracking-tight ${
          isLowTime ? 'text-[var(--color-danger)] timer-warning' : 'text-[var(--color-text-primary)]'
        }`}
      >
        {formatTime(gameTime)}
      </div>

      {/* Shot clock */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{t.shotClock}</span>
        <div
          className={`text-2xl sm:text-3xl md:text-4xl font-mono font-bold ${
            isShotClockLow ? 'text-[var(--color-warning)] timer-warning' : 'text-[var(--color-accent)]'
          }`}
        >
          {formatShotClock(shotClock)}
        </div>
      </div>

      {/* Timer controls - responsive layout */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-1 sm:mt-2">
        <button
          onClick={handleToggleTimer}
          className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold text-white btn-press transition-colors ${
            isRunning
              ? 'bg-[var(--color-danger)] hover:bg-red-600'
              : 'bg-[var(--color-success)] hover:bg-green-600'
          }`}
        >
          {isRunning ? t.pause : t.start}
        </button>

        <button
          onClick={() => resetShotClock(true)}
          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-[var(--color-accent)] text-white hover:bg-orange-600 btn-press transition-colors"
          title="Reset shot clock (24s)"
        >
          24
        </button>

        <button
          onClick={() => resetShotClock(false)}
          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          title="Reset shot clock (14s)"
        >
          14
        </button>

        <button
          onClick={resetGameTime}
          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          title={t.reset}
        >
          {t.reset}
        </button>

        <button
          onClick={nextPeriod}
          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors disabled:opacity-50"
          disabled={gameTime > 0}
          title="Next period"
        >
          <span className="hidden sm:inline">{t.period}</span> →
        </button>
      </div>
    </div>
  );
}
