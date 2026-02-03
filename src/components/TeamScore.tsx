import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { FoulIndicator } from './FoulIndicator';
import { TimeoutIndicator } from './TimeoutIndicator';
import { usePermissions } from '../hooks/usePermissions';
import type { Team } from '../stores/gameStore';

interface TeamScoreProps {
  team: Team;
  isPortrait?: boolean;
}

export function TeamScore({ team, isPortrait = false }: TeamScoreProps) {
  const {
    home,
    away,
    possession,
    animatingScore,
    language,
    rules,
    addScore,
    addFoul,
    callTimeout,
    setPossession,
    setSelectedTeam,
  } = useGameStore();

  const permissions = usePermissions();
  const t = translations[language];
  const teamState = team === 'home' ? home : away;
  const hasPossession = possession === team;
  const isAnimating = animatingScore === team;
  const isHome = team === 'home';

  // Mobile expanded state for secondary actions (Foul/Timeout/Possession)
  const [showMore, setShowMore] = useState(false);

  // Check if any secondary action is available
  const hasSecondaryActions = permissions.canFoul || permissions.canTimeout || permissions.canPossession;

  // Calculate timeouts remaining for mobile display
  const timeoutsUsed = teamState.timeouts;
  const maxTimeouts = rules.maxTimeoutsPerHalf;
  const timeoutsRemaining = maxTimeouts - timeoutsUsed;

  return (
    <div
      className={`flex flex-col items-center p-2 sm:p-3 md:p-4 rounded-xl transition-all ${
        hasPossession ? 'ring-2 ring-[var(--color-accent)]' : ''
      }`}
      style={{
        backgroundColor: `${teamState.color}20`,
        borderLeft: isHome ? `4px solid ${teamState.color}` : 'none',
        borderRight: !isHome ? `4px solid ${teamState.color}` : 'none',
      }}
    >
      {/* Team name */}
      <div
        className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider cursor-pointer hover:opacity-80"
        style={{ color: teamState.color }}
        onClick={() => setSelectedTeam(team)}
      >
        {teamState.name}
      </div>

      {/* Score display - Portrait: display only; Others: click to open player stats */}
      <div
        className={`text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold my-2 sm:my-3 md:my-4 transition-transform ${
          isAnimating ? 'score-animate' : ''
        } ${!isPortrait ? 'cursor-pointer hover:opacity-80' : ''}`}
        style={{ color: teamState.color }}
        onClick={() => !isPortrait && setSelectedTeam(team)}
        title={!isPortrait ? (language === 'en' ? 'View player stats' : '查看球员数据') : undefined}
      >
        {teamState.score}
      </div>

      {/* Portrait: Plus and Minus buttons */}
      {isPortrait && permissions.canScore && (
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => addScore(team, 1)}
            className="min-h-[48px] min-w-[64px] rounded-lg text-2xl font-bold bg-[var(--color-success)] text-white hover:bg-green-600 btn-press transition-colors"
          >
            +
          </button>
          <button
            onClick={() => addScore(team, -1)}
            className="min-h-[48px] min-w-[64px] rounded-lg text-2xl font-bold bg-gray-600 text-white hover:bg-gray-700 btn-press transition-colors"
          >
            −
          </button>
        </div>
      )}

      {/* Mobile landscape: Score buttons - always visible */}
      {!isPortrait && permissions.canScore && (
        <div className="md:hidden grid grid-cols-3 gap-2 w-full mb-2">
          <button
            onClick={() => addScore(team, 1)}
            className="min-h-[44px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          >
            +1
          </button>
          <button
            onClick={() => addScore(team, 2)}
            className="min-h-[44px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          >
            +2
          </button>
          <button
            onClick={() => addScore(team, 3)}
            className="min-h-[44px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          >
            +3
          </button>
        </div>
      )}

      {/* Portrait: Compact fouls/timeouts display */}
      {isPortrait && (
        <div className="flex justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <span className={teamState.fouls >= rules.bonusFouls ? 'text-[var(--color-warning)]' : ''}>
            F {teamState.fouls}/{rules.bonusFouls}
          </span>
          <span className={timeoutsRemaining === 0 ? 'text-[var(--color-danger)]' : ''}>
            TO {timeoutsRemaining}/{maxTimeouts}
          </span>
        </div>
      )}

      {/* Mobile landscape: Compact fouls/timeouts display */}
      {!isPortrait && (
        <div className="md:hidden flex justify-center gap-4 text-sm text-[var(--color-text-secondary)] mb-2">
          <span className={teamState.fouls >= rules.bonusFouls ? 'text-[var(--color-warning)]' : ''}>
            F {teamState.fouls}/{rules.bonusFouls}
          </span>
          <span className={timeoutsRemaining === 0 ? 'text-[var(--color-danger)]' : ''}>
            TO {timeoutsRemaining}/{maxTimeouts}
          </span>
        </div>
      )}

      {/* Mobile landscape: More button for secondary actions */}
      {!isPortrait && hasSecondaryActions && (
        <div className="md:hidden w-full">
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {showMore ? '▲' : '⋯'}
          </button>

          {/* Secondary actions panel */}
          {showMore && (
            <div className="grid grid-cols-3 gap-2 mt-1 animate-fade-in">
              {permissions.canFoul && (
                <button
                  onClick={() => addFoul(team)}
                  className="min-h-[40px] rounded-lg text-sm font-semibold bg-[var(--color-warning)] text-black hover:bg-yellow-500 btn-press transition-colors"
                >
                  +Foul
                </button>
              )}
              {permissions.canTimeout && (
                <button
                  onClick={() => callTimeout(team)}
                  className="min-h-[40px] rounded-lg text-sm font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
                >
                  TO
                </button>
              )}
              {permissions.canPossession && (
                <button
                  onClick={() => setPossession(team)}
                  className={`min-h-[40px] rounded-lg text-sm font-semibold btn-press transition-colors ${
                    hasPossession
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600'
                  }`}
                >
                  ◄►
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Desktop: Score hint button */}
      {(permissions.canScore || permissions.canFoul || permissions.canEditPlayers) && (
        <button
          onClick={() => setSelectedTeam(team)}
          className="hidden md:flex mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors items-center gap-1 sm:gap-2"
        >
          📊 {language === 'en' ? 'Add Stats' : '添加数据'}
        </button>
      )}

      {/* Desktop: Fouls and Timeouts row */}
      <div className="hidden md:flex gap-3 sm:gap-4 md:gap-6 items-center">
        <FoulIndicator team={team} />
        <TimeoutIndicator team={team} />
      </div>

      {/* Desktop: Action buttons - always visible */}
      <div className="hidden md:flex gap-1 sm:gap-2 mt-2 sm:mt-3 md:mt-4">
        {permissions.canFoul && (
          <button
            onClick={() => addFoul(team)}
            className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-[var(--color-warning)] text-black hover:bg-yellow-500 btn-press transition-colors"
          >
            {t.addFoul}
          </button>
        )}
        {permissions.canTimeout && (
          <button
            onClick={() => callTimeout(team)}
            className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
          >
            {t.timeout}
          </button>
        )}
        {permissions.canPossession && (
          <button
            onClick={() => setPossession(team)}
            className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold btn-press transition-colors ${
              hasPossession
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600'
            }`}
          >
            ◄►
          </button>
        )}
      </div>
    </div>
  );
}
