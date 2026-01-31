import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import type { Team } from '../stores/gameStore';

interface FoulIndicatorProps {
  team: Team;
}

export function FoulIndicator({ team }: FoulIndicatorProps) {
  const { home, away, rules, language } = useGameStore();
  const t = translations[language];
  const teamState = team === 'home' ? home : away;

  const fouls = teamState.fouls;
  const bonusFouls = rules.bonusFouls;
  const doubleBonusFouls = rules.doubleBonusFouls;

  const isBonus = fouls >= bonusFouls;
  const isDoubleBonus = doubleBonusFouls > 0 && fouls >= doubleBonusFouls;

  // Create foul dots (max 5 visible)
  const maxVisibleFouls = Math.max(bonusFouls, 5);
  const foulDots = Array.from({ length: maxVisibleFouls }, (_, i) => i < fouls);

  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <div className="text-[10px] sm:text-xs text-[var(--color-text-secondary)] uppercase">
        {t.fouls}
      </div>

      <div className="flex gap-0.5 sm:gap-1">
        {foulDots.map((isFouled, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              isFouled
                ? isDoubleBonus
                  ? 'bg-[var(--color-danger)]'
                  : isBonus
                  ? 'bg-[var(--color-warning)]'
                  : 'bg-[var(--color-accent)]'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-text-secondary)]'
            }`}
          />
        ))}
      </div>

      {/* Bonus indicator */}
      {isDoubleBonus && (
        <div className="text-[10px] sm:text-xs font-bold text-[var(--color-danger)] animate-pulse">
          {t.doubleBonus}
        </div>
      )}
      {isBonus && !isDoubleBonus && (
        <div className="text-[10px] sm:text-xs font-bold text-[var(--color-warning)]">
          {t.bonus}
        </div>
      )}
    </div>
  );
}
