import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { FoulIndicator } from './FoulIndicator';
import { TimeoutIndicator } from './TimeoutIndicator';
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
    addFoul,
    callTimeout,
    setPossession,
    setSelectedTeam,
  } = useGameStore();

  const t = translations[language];
  const teamState = team === 'home' ? home : away;
  const hasPossession = possession === team;
  const isAnimating = animatingScore === team;
  const isHome = team === 'home';

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

      {/* Score - clickable to open player stats */}
      <div
        className={`text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold my-2 sm:my-3 md:my-4 transition-transform cursor-pointer hover:opacity-80 ${
          isAnimating ? 'score-animate' : ''
        }`}
        style={{ color: teamState.color }}
        onClick={() => setSelectedTeam(team)}
        title={language === 'en' ? 'Click to add score via player' : '点击通过球员加分'}
      >
        {teamState.score}
      </div>

      {/* Score hint */}
      <button
        onClick={() => setSelectedTeam(team)}
        className="mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors flex items-center gap-1 sm:gap-2"
      >
        📊 <span className="hidden xs:inline sm:inline">{language === 'en' ? 'Add Stats' : '添加数据'}</span>
      </button>

      {/* Fouls and Timeouts row */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
        <FoulIndicator team={team} />
        <TimeoutIndicator team={team} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 md:mt-4">
        <button
          onClick={() => addFoul(team)}
          className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-[var(--color-warning)] text-black hover:bg-yellow-500 btn-press transition-colors"
        >
          <span className="hidden sm:inline">{t.addFoul}</span>
          <span className="sm:hidden">+F</span>
        </button>
        <button
          onClick={() => callTimeout(team)}
          className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 btn-press transition-colors"
        >
          <span className="hidden sm:inline">{t.timeout}</span>
          <span className="sm:hidden">TO</span>
        </button>
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
      </div>
    </div>
  );
}
