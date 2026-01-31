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
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <div className="text-[10px] sm:text-xs text-[var(--color-text-secondary)] uppercase">
        {t.timeout}
      </div>

      <div className="flex gap-0.5 sm:gap-1">
        {timeoutDots.map((isAvailable, index) => (
          <div
            key={index}
            className={`w-3 h-1.5 sm:w-4 sm:h-2 rounded-sm transition-colors ${
              isAvailable
                ? 'bg-[var(--color-success)]'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-text-secondary)]'
            }`}
          />
        ))}
      </div>

      <div className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">
        {timeoutsRemaining}
      </div>
    </div>
  );
}
