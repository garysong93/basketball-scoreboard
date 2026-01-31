import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useGameIntelligence, type GameAlert } from '../hooks/useGameIntelligence';

interface GameAssistantProps {
  minimized?: boolean;
}

export function GameAssistant({ minimized = false }: GameAssistantProps) {
  const { language } = useGameStore();
  const { activeAlerts, dismissAlert, dismissAllAlerts } = useGameIntelligence();
  const [isExpanded, setIsExpanded] = useState(!minimized);

  // Auto-expand when new high-priority alert comes in
  useEffect(() => {
    const hasHighPriority = activeAlerts.some(a => a.priority >= 4);
    if (hasHighPriority && !isExpanded) {
      setIsExpanded(true);
    }
  }, [activeAlerts, isExpanded]);

  // Hide panel completely when no alerts exist (must be after all hooks)
  if (activeAlerts.length === 0) {
    return null;
  }

  const content = {
    en: {
      title: 'AI Assistant',
      noAlerts: 'All clear! No alerts.',
      dismissAll: 'Dismiss All',
      expand: 'Show Alerts',
      collapse: 'Hide',
    },
    zh: {
      title: 'AI 助手',
      noAlerts: '一切正常！暂无提醒。',
      dismissAll: '全部忽略',
      expand: '显示提醒',
      collapse: '收起',
    },
  };

  const t = content[language];

  const getAlertStyles = (alert: GameAlert) => {
    const baseStyles = 'rounded-lg p-3 mb-2 flex items-start gap-3 animate-fade-in text-[var(--color-text-primary)]';

    switch (alert.type) {
      case 'danger':
        return `${baseStyles} bg-red-500/20 border border-red-500/50`;
      case 'warning':
        return `${baseStyles} bg-yellow-500/20 border border-yellow-500/50`;
      case 'success':
        return `${baseStyles} bg-green-500/20 border border-green-500/50`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500/20 border border-blue-500/50`;
    }
  };

  const getAlertIcon = (alert: GameAlert) => {
    switch (alert.category) {
      case 'foul':
        return '⚠️';
      case 'timeout':
        return '⏸️';
      case 'score':
        return '🏀';
      case 'time':
        return '⏰';
      case 'period':
        return '📢';
      default:
        return '💡';
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 5) return '🔴';
    if (priority >= 4) return '🟠';
    if (priority >= 3) return '🟡';
    return '';
  };

  // Minimized view - collapsed sidebar tab
  if (!isExpanded) {
    return (
      <div className="hidden lg:flex flex-col items-center w-12 flex-shrink-0">
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex flex-col items-center gap-2 px-2 py-4 rounded-xl transition-all ${
            activeAlerts.length > 0
              ? 'bg-[var(--color-accent)] text-white animate-pulse'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
          }`}
        >
          <span className="text-xl">🤖</span>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeAlerts.length}
            </span>
          )}
          <span className="text-xs writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>{t.expand}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-primary)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold text-[var(--color-text-primary)]">{t.title}</h3>
          {activeAlerts.length > 0 && (
            <span className="bg-[var(--color-accent)] text-white text-xs font-bold rounded-full px-2 py-0.5">
              {activeAlerts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && (
            <button
              onClick={dismissAllAlerts}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {t.dismissAll}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm"
          >
            {t.collapse}
          </button>
        </div>
      </div>

      {/* Alerts list */}
      <div className="p-3 flex-1 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-secondary)]">
            <div className="text-4xl mb-2">✅</div>
            <p>{t.noAlerts}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={getAlertStyles(alert)}
              >
                <span className="text-lg flex-shrink-0">
                  {getAlertIcon(alert)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">
                      {getPriorityBadge(alert.priority)} {language === 'en' ? alert.message : alert.messageZh}
                    </p>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-xs opacity-60 hover:opacity-100 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact inline version for the scoreboard
export function GameAssistantInline() {
  const { language } = useGameStore();
  const { activeAlerts, dismissAlert } = useGameIntelligence();

  if (activeAlerts.length === 0) return null;

  // Only show the highest priority alert inline
  const topAlert = activeAlerts[0];
  if (!topAlert) return null;

  const getAlertBg = () => {
    switch (topAlert.type) {
      case 'danger':
        return 'bg-red-500/30 border-red-500';
      case 'warning':
        return 'bg-yellow-500/30 border-yellow-500';
      case 'success':
        return 'bg-green-500/30 border-green-500';
      default:
        return 'bg-blue-500/30 border-blue-500';
    }
  };

  return (
    <div className={`mx-2 sm:mx-4 mb-2 p-2 rounded-lg border ${getAlertBg()} flex items-center justify-between gap-2 animate-fade-in`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm sm:text-base">🤖</span>
        <p className="text-xs sm:text-sm truncate text-[var(--color-text-primary)]">
          {language === 'en' ? topAlert.message : topAlert.messageZh}
        </p>
      </div>
      <button
        onClick={() => dismissAlert(topAlert.id)}
        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2"
      >
        ✕
      </button>
    </div>
  );
}

// Mobile bottom sheet version for full alerts view
interface GameAssistantMobileProps {
  onClose: () => void;
}

export function GameAssistantMobile({ onClose }: GameAssistantMobileProps) {
  const { language } = useGameStore();
  const { activeAlerts, dismissAlert, dismissAllAlerts } = useGameIntelligence();

  const content = {
    en: {
      title: 'AI Assistant',
      noAlerts: 'All clear! No alerts at this time.',
      dismissAll: 'Dismiss All',
      close: 'Close',
    },
    zh: {
      title: 'AI 助手',
      noAlerts: '一切正常！暂无提醒。',
      dismissAll: '全部忽略',
      close: '关闭',
    },
  };

  const t = content[language];

  const getAlertStyles = (alert: GameAlert) => {
    const baseStyles = 'rounded-lg p-3 flex items-start gap-3 animate-fade-in text-[var(--color-text-primary)]';

    switch (alert.type) {
      case 'danger':
        return `${baseStyles} bg-red-500/20 border border-red-500/50`;
      case 'warning':
        return `${baseStyles} bg-yellow-500/20 border border-yellow-500/50`;
      case 'success':
        return `${baseStyles} bg-green-500/20 border border-green-500/50`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500/20 border border-blue-500/50`;
    }
  };

  const getAlertIcon = (alert: GameAlert) => {
    switch (alert.category) {
      case 'foul':
        return '⚠️';
      case 'timeout':
        return '⏸️';
      case 'score':
        return '🏀';
      case 'time':
        return '⏰';
      case 'period':
        return '📢';
      default:
        return '💡';
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 5) return '🔴';
    if (priority >= 4) return '🟠';
    if (priority >= 3) return '🟡';
    return '';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center lg:hidden"
      onClick={onClose}
    >
      {/* Bottom sheet */}
      <div
        className="w-full max-h-[70vh] bg-[var(--color-bg-primary)] rounded-t-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">{t.title}</h3>
            {activeAlerts.length > 0 && (
              <span className="bg-[var(--color-accent)] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeAlerts.length > 0 && (
              <button
                onClick={dismissAllAlerts}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {t.dismissAll}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-lg">{t.noAlerts}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={getAlertStyles(alert)}
                >
                  <span className="text-xl flex-shrink-0">
                    {getAlertIcon(alert)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        {getPriorityBadge(alert.priority)} {language === 'en' ? alert.message : alert.messageZh}
                      </p>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-sm opacity-60 hover:opacity-100 flex-shrink-0 px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
