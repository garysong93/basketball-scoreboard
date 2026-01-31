import { useGameStore } from '../stores/gameStore';
import { formatTime } from '../utils/rules';

interface GameTimelineProps {
  onClose: () => void;
}

export function GameTimeline({ onClose }: GameTimelineProps) {
  const { events, home, away, language, rules } = useGameStore();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'score':
        return '🏀';
      case 'foul':
        return '🟡';
      case 'timeout':
        return '⏸️';
      case 'period_start':
        return '🔔';
      case 'period_end':
        return '🏁';
      case 'substitution':
        return '🔄';
      case 'assist':
        return '🅰️';
      case 'rebound':
        return '🔄';
      case 'steal':
        return '🖐️';
      case 'block':
        return '🚫';
      case 'turnover':
        return '❌';
      default:
        return '📝';
    }
  };

  const getTeamColor = (team?: 'home' | 'away') => {
    if (team === 'home') return home.color;
    if (team === 'away') return away.color;
    return 'var(--color-text-secondary)';
  };

  const getPeriodLabel = (period: number) => {
    if (period > rules.periodCount) {
      return language === 'en' ? `OT${period - rules.periodCount}` : `加时${period - rules.periodCount}`;
    }
    return language === 'en' ? `Q${period}` : `第${period}节`;
  };

  // Get dynamic event description using current team names
  const getEventDescription = (event: typeof events[0]) => {
    const teamName = event.team === 'home' ? home.name : event.team === 'away' ? away.name : '';

    // If description starts with # (player number), it has player info - keep as is
    if (event.description.startsWith('#')) {
      return event.description;
    }

    // For events without player info, reconstruct with current team name
    switch (event.type) {
      case 'score':
        return event.team ? `${teamName} +${event.value}` : event.description;
      case 'foul':
        return event.team ? `${teamName} foul` : event.description;
      case 'timeout':
        return event.team ? `${teamName} timeout` : event.description;
      default:
        return event.description;
    }
  };

  // Group events by period
  const eventsByPeriod = events.reduce((acc, event) => {
    const period = event.period;
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(event);
    return acc;
  }, {} as Record<number, typeof events>);

  const periods = Object.keys(eventsByPeriod)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] w-full sm:max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3 sm:p-4 flex justify-between items-center bg-[var(--color-bg-secondary)]">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            📋 {language === 'en' ? 'Game Timeline' : '比赛时间线'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current score summary */}
        <div className="p-3 sm:p-4 bg-[var(--color-bg-secondary)]/50 flex justify-center items-center gap-4 sm:gap-8">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate max-w-[80px] sm:max-w-none">{home.name}</div>
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: home.color }}>
              {home.score}
            </div>
          </div>
          <div className="text-xl sm:text-2xl text-[var(--color-text-secondary)]">-</div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate max-w-[80px] sm:max-w-none">{away.name}</div>
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: away.color }}>
              {away.score}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          {events.length === 0 ? (
            <div className="text-center text-[var(--color-text-secondary)] py-8">
              {language === 'en'
                ? 'No events yet. Start the game to see the timeline.'
                : '暂无事件。开始比赛后将显示时间线。'}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {periods.map((period) => (
                <div key={period}>
                  {/* Period header */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="h-px flex-1 bg-[var(--color-text-secondary)]/30" />
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-xs sm:text-sm font-semibold">
                      {getPeriodLabel(period)}
                    </span>
                    <div className="h-px flex-1 bg-[var(--color-text-secondary)]/30" />
                  </div>

                  {/* Events in this period */}
                  <div className="space-y-1.5 sm:space-y-2">
                    {eventsByPeriod[period]
                      .slice()
                      .reverse()
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-slate-700/50 transition-colors"
                        >
                          {/* Time */}
                          <div className="w-12 sm:w-16 text-center font-mono text-xs sm:text-sm text-[var(--color-text-secondary)]">
                            {formatTime(event.gameTime)}
                          </div>

                          {/* Icon */}
                          <div className="text-base sm:text-xl">{getEventIcon(event.type)}</div>

                          {/* Team indicator */}
                          {event.team && (
                            <div
                              className="w-1.5 sm:w-2 h-6 sm:h-8 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getTeamColor(event.team) }}
                            />
                          )}

                          {/* Description */}
                          <div className="flex-1 min-w-0">
                            <span
                              className="font-medium text-sm sm:text-base truncate block"
                              style={{ color: event.team ? getTeamColor(event.team) : 'inherit' }}
                            >
                              {getEventDescription(event)}
                            </span>
                          </div>

                          {/* Value (for scores) */}
                          {event.type === 'score' && event.value && (
                            <div
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold text-white text-xs sm:text-sm flex-shrink-0"
                              style={{ backgroundColor: getTeamColor(event.team) }}
                            >
                              +{event.value}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with stats summary */}
        {events.length > 0 && (
          <div className="p-3 sm:p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-primary)]">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[var(--color-text-secondary)]">
                  {language === 'en' ? 'Total Events: ' : '总事件数：'}
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {events.length}
                </span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">
                  {language === 'en' ? 'Scoring Plays: ' : '得分回合：'}
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {events.filter((e) => e.type === 'score').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
