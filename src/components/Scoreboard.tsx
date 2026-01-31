import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { TeamScore } from './TeamScore';
import { Timer } from './Timer';
import { PlayerStats } from './PlayerStats';
import { Settings } from './Settings';
import { KeyboardHelp } from './KeyboardHelp';
import { VoiceControl, VoiceHelp } from './VoiceControl';
import { GameTimeline } from './GameTimeline';
import { SharePanel } from './SharePanel';
import { GameAssistant, GameAssistantInline, GameAssistantMobile } from './GameAssistant';
import { ReportPanel } from './ReportPanel';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSync } from '../hooks/useSync';

export function Scoreboard() {
  const { language, theme, selectedTeam, setSelectedTeam, isFullscreen, setFullscreen, newGame } = useGameStore();
  const t = translations[language];
  const { isHost, isViewer, gameId } = useSync();

  // Check if Firebase is configured for Share functionality
  const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileAssistant, setShowMobileAssistant] = useState(false);

  // Enable keyboard shortcuts (disabled in viewer mode)
  useKeyboard();

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    }
  };

  const copyOBSLink = () => {
    const obsUrl = `${window.location.origin}/obs`;
    navigator.clipboard.writeText(obsUrl);
    alert(t.linkCopied);
  };

  // Get sync status indicator
  const getSyncIndicator = () => {
    if (isHost) {
      return { icon: '📡', color: 'text-[var(--color-success)]', label: language === 'en' ? 'Hosting' : '托管中' };
    }
    if (isViewer) {
      return { icon: '👁️', color: 'text-[var(--color-accent)]', label: language === 'en' ? 'Viewing' : '观看中' };
    }
    return null;
  };

  const syncIndicator = getSyncIndicator();

  const handleNewGame = () => {
    if (window.confirm(t.confirmNewGame)) {
      newGame();
    }
  };

  return (
    <div className={`scoreboard-container h-full flex flex-col ${theme === 'light' ? 'light' : ''}`}>
      {/* Sync status bar (when syncing) */}
      {syncIndicator && (
        <div className="flex items-center justify-center gap-2 py-2 bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-primary)]">
          <span className={syncIndicator.color}>{syncIndicator.icon}</span>
          <span className="text-sm text-[var(--color-text-secondary)]">
            {syncIndicator.label}
          </span>
          {gameId && (
            <span className="ml-2 px-2 py-0.5 rounded bg-[var(--color-bg-primary)] font-mono text-sm text-[var(--color-accent)]">
              {gameId}
            </span>
          )}
          {isViewer && (
            <span className="ml-2 px-2 py-0.5 rounded bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs">
              {language === 'en' ? 'Read-only' : '只读'}
            </span>
          )}
        </div>
      )}

      {/* AI Assistant inline alert */}
      <GameAssistantInline />

      {/* Main scoreboard area with sidebar */}
      <div className="flex-1 flex p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4 overflow-hidden">
        {/* Scoreboard content - takes available space */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 w-full max-w-5xl">
            {/* Home team */}
            <div className="flex-1 min-w-0">
              <TeamScore team="home" />
            </div>

            {/* Center - Timer and period */}
            <div className="flex-shrink-0">
              <Timer />
            </div>

            {/* Away team */}
            <div className="flex-1 min-w-0">
              <TeamScore team="away" />
            </div>
          </div>
        </div>

        {/* AI Assistant sidebar - fixed width on right (desktop only) */}
        <GameAssistant />
      </div>

      {/* Bottom toolbar - responsive with priority-based layout */}
      <div className="relative flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-3 md:p-4 bg-[var(--color-bg-secondary)]">
        {/* === PRIMARY ACTIONS (Always visible) === */}

        {/* Settings - First for initial setup */}
        {!isViewer && (
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-[var(--color-accent)] text-white hover:bg-orange-600 transition-colors"
            title={language === 'en' ? 'Game settings, team names, rules' : '比赛设置、队名、规则'}
          >
            ⚙️ <span className="hidden sm:inline">{t.settings}</span>
          </button>
        )}

        {/* New Game - Reset all data */}
        {!isViewer && (
          <button
            onClick={handleNewGame}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 transition-colors"
            title={language === 'en' ? 'Start a new game (reset all data)' : '开始新比赛（重置所有数据）'}
          >
            🔄 <span className="hidden sm:inline">{t.newGame}</span>
          </button>
        )}

        {/* Player Stats - Most used during game */}
        {!isViewer && (
          <button
            onClick={() => setSelectedTeam('home')}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-[var(--color-success)] text-white hover:bg-green-600 transition-colors"
            title={language === 'en' ? 'Add scores and track player stats' : '加分和记录球员数据'}
          >
            📊 <span className="hidden sm:inline">{t.playerStats}</span>
          </button>
        )}

        {/* Timeline - View game events */}
        <button
          onClick={() => setShowTimeline(true)}
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
          title={language === 'en' ? 'View game events history' : '查看比赛事件历史'}
        >
          📋 <span className="hidden md:inline">{language === 'en' ? 'Timeline' : '时间线'}</span>
        </button>

        {/* Fullscreen - For actual game use */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
          title={language === 'en' ? 'Toggle fullscreen mode' : '切换全屏模式'}
        >
          {isFullscreen ? '⛶' : '⛶'} <span className="hidden md:inline">{isFullscreen ? t.exitFullscreen : t.fullscreen}</span>
        </button>

        {/* Share - Real-time sync (only show if Firebase is configured) */}
        {isFirebaseConfigured && (
          <button
            onClick={() => setShowShare(true)}
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              isHost
                ? 'bg-[var(--color-success)] text-white'
                : isViewer
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700'
            }`}
            title={language === 'en' ? 'Share with other devices (real-time sync)' : '分享到其他设备（实时同步）'}
          >
            🔗 <span className="hidden md:inline">{language === 'en' ? 'Share' : '分享'}</span>
          </button>
        )}

        {/* AI Assistant button (mobile only) */}
        <button
          onClick={() => setShowMobileAssistant(true)}
          className="lg:hidden flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
          title={language === 'en' ? 'AI Assistant' : 'AI 助手'}
        >
          🤖 <span className="hidden sm:inline">AI</span>
        </button>

        {/* Divider (tablet+ only) */}
        <div className="hidden md:block w-px h-8 bg-[var(--color-text-secondary)]/30" />

        {/* === SECONDARY ACTIONS (Hidden in "More" menu on mobile) === */}

        {/* Desktop: Show all secondary actions */}
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          {/* Keyboard Shortcuts */}
          {!isViewer && (
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
              title={language === 'en' ? 'Learn keyboard shortcuts' : '学习键盘快捷键'}
            >
              ⌨️ <span className="hidden lg:inline">{t.keyboard}</span>
            </button>
          )}

          {/* Export */}
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
            title={language === 'en' ? 'Export game report' : '导出比赛报告'}
          >
            📄 <span className="hidden lg:inline">{language === 'en' ? 'Export' : '导出'}</span>
          </button>

          {/* OBS Link */}
          {!isViewer && (
            <button
              onClick={copyOBSLink}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
              title={language === 'en' ? 'Copy OBS overlay link for live streaming' : '复制OBS叠加层链接用于直播'}
            >
              📺 <span className="hidden lg:inline">{t.copyObsLink}</span>
            </button>
          )}

          {/* Voice control */}
          {!isViewer && (
            <div className="flex items-center">
              <VoiceControl />
              <button
                onClick={() => setShowVoiceHelp(true)}
                className="flex items-center px-2 py-2 rounded-r-lg bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors text-sm -ml-2 border-l border-[var(--color-bg-secondary)]"
                title={language === 'en' ? 'Voice commands help' : '语音命令帮助'}
              >
                ❓
              </button>
            </div>
          )}
        </div>

        {/* Mobile: "More" menu button */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
            title={language === 'en' ? 'More options' : '更多选项'}
          >
            ⋯
          </button>

          {/* Dropdown menu */}
          {showMoreMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMoreMenu(false)}
              />
              {/* Menu */}
              <div className="absolute bottom-full right-0 mb-2 w-48 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] shadow-xl z-50">
                {!isViewer && (
                  <button
                    onClick={() => { setShowKeyboardHelp(true); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    ⌨️ {t.keyboard}
                  </button>
                )}
                <button
                  onClick={() => { setShowReport(true); setShowMoreMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  📄 {language === 'en' ? 'Export Report' : '导出报告'}
                </button>
                {!isViewer && (
                  <button
                    onClick={() => { copyOBSLink(); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    📺 {t.copyObsLink}
                  </button>
                )}
                {!isViewer && (
                  <button
                    onClick={() => { setShowVoiceHelp(true); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    🎤 {language === 'en' ? 'Voice Commands' : '语音命令'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedTeam && !isViewer && (
        <PlayerStats team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}

      {showSettings && !isViewer && <Settings onClose={() => setShowSettings(false)} />}

      {showKeyboardHelp && !isViewer && <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />}

      {showVoiceHelp && !isViewer && <VoiceHelp onClose={() => setShowVoiceHelp(false)} />}

      {showTimeline && <GameTimeline onClose={() => setShowTimeline(false)} />}

      {showShare && <SharePanel onClose={() => setShowShare(false)} />}

      {showReport && <ReportPanel onClose={() => setShowReport(false)} />}

      {/* Mobile AI Assistant bottom sheet */}
      {showMobileAssistant && (
        <GameAssistantMobile onClose={() => setShowMobileAssistant(false)} />
      )}
    </div>
  );
}
