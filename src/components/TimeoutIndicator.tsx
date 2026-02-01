import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import type { Team } from '../stores/gameStore';

interface TimeoutIndicatorProps {
  team: Team;
}

export function TimeoutIndicator({ team }: TimeoutIndicatorProps) {
  const { home, away, rules, language } = useGameStore();
  const t = translations[language];
  const teamState = team === 'home' ? home : away;

  const timeoutsUsed = teamState.timeouts;
  const maxTimeouts = rules.maxTimeoutsPerHalf;
  const timeoutsRemaining = maxTimeouts - timeoutsUsed;

  // Create timeout indicators
  const timeoutDots = Array.from({ length: maxTimeouts }, (_, i) => i >= timeoutsUsed);

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      {/* Mobile: Show timeouts as number */}
      <div className="md:hidden">
        <div className="text-xs text-[var(--color-text-secondary)] uppercase mb-0.5">
          {t.timeout}
        </div>
        <div className={`text-lg font-bold ${
          timeoutsRemaining === 0
            ? 'text-[var(--color-danger)]'
            : timeoutsRemaining <= 1
            ? 'text-[var(--color-warning)]'
            : 'text-[var(--color-success)]'
        }`}>
          {timeoutsRemaining}/{maxTimeouts}
        </div>
      </div>

      {/* Desktop: Show timeout bars */}
      <div className="hidden md:flex flex-col items-center gap-1">
        <div className="text-xs text-[var(--color-text-secondary)] uppercase">
          {t.timeout}
        </div>

        <div className="flex gap-1">
          {timeoutDots.map((isAvailable, index) => (
            <div
              key={index}
              className={`w-4 h-2 rounded-sm transition-colors ${
                isAvailable
                  ? 'bg-[var(--color-success)]'
                  : 'bg-[var(--color-bg-secondary)] border border-[var(--color-text-secondary)]'
              }`}
            />
          ))}
        </div>

        <div className="text-xs text-[var(--color-text-secondary)]">
          {timeoutsRemaining}
        </div>
      </div>
    </div>
  );
}
