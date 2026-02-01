import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { FoulIndicator } from './FoulIndicator';
import { TimeoutIndicator } from './TimeoutIndicator';
import { usePermissions } from '../hooks/usePermissions';
import type { Team } from '../stores/gameStore';

interface TeamScoreProps {
  team: Team;
}

export function TeamScore({ team }: TeamScoreProps) {
  const {
    home,
    away,
    possession,
    animatingScore,
    language,
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

  // Mobile expanded state for action panel
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any action is available
  const hasAnyAction = permissions.canScore || permissions.canFoul || permissions.canTimeout || permissions.canPossession;

  return (
    <div
      className={`flex flex-col items-center p-2 sm:p-3 md:p-4 rounded-xl transition-all ${
        hasPossession ? 'ring-2 ring-[var(--color-accent)]' : ''
      }`}
      style={{
        backgroundColor: `${teamState.color}15`,
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

      {/* Score - clickable to expand actions on mobile, open player stats on desktop */}
      <button
        className={`text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold my-2 sm:my-3 md:my-4 transition-transform cursor-pointer hover:opacity-80 bg-transparent border-none ${
          isAnimating ? 'score-animate' : ''
        }`}
        style={{ color: teamState.color }}
        onClick={() => {
          // On mobile, toggle expanded panel; on desktop, open player stats
          if (window.innerWidth < 768 && hasAnyAction) {
            setIsExpanded(!isExpanded);
          } else {
            setSelectedTeam(team);
          }
        }}
        title={language === 'en' ? 'Tap for actions' : '点击操作'}
      >
        {teamState.score}
      </button>

      {/* Mobile: Tap hint */}
      {hasAnyAction && (
        <div
          className="md:hidden text-xs text-[var(--color-text-secondary)] mb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded
            ? (language === 'en' ? '▲ tap to close' : '▲ 点击收起')
            : (language === 'en' ? '▼ tap for actions' : '▼ 点击操作')
          }
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

      {/* Mobile: Expanded action panel */}
      {isExpanded && (
        <div className="md:hidden w-full animate-fade-in mb-3">
          {/* Score buttons */}
          {permissions.canScore && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => addScore(team, 1)}
                className="min-h-[48px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => addScore(team, 2)}
                className="min-h-[48px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
              >
                +2
              </button>
              <button
                onClick={() => addScore(team, 3)}
                className="min-h-[48px] rounded-lg text-lg font-bold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
              >
                +3
              </button>
            </div>
          )}

          {/* Action buttons row */}
          <div className="grid grid-cols-3 gap-2">
            {permissions.canFoul && (
              <button
                onClick={() => addFoul(team)}
                className="min-h-[48px] rounded-lg text-sm font-semibold bg-[var(--color-warning)] text-black hover:bg-yellow-500 btn-press transition-colors"
              >
                +Foul
              </button>
            )}
            {permissions.canTimeout && (
              <button
                onClick={() => callTimeout(team)}
                className="min-h-[48px] rounded-lg text-sm font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
              >
                Timeout
              </button>
            )}
            {permissions.canPossession && (
              <button
                onClick={() => setPossession(team)}
                className={`min-h-[48px] rounded-lg text-sm font-semibold btn-press transition-colors ${
                  hasPossession
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600'
                }`}
              >
                ◄►
              </button>
            )}
          </div>

          {/* Player stats link */}
          <button
            onClick={() => setSelectedTeam(team)}
            className="w-full mt-3 min-h-[48px] rounded-lg text-sm font-medium bg-[var(--color-success)] text-white hover:bg-green-600 btn-press transition-colors flex items-center justify-center gap-2"
          >
            📊 {language === 'en' ? 'Player Stats' : '球员数据'}
          </button>
        </div>
      )}

      {/* Fouls and Timeouts row */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
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
