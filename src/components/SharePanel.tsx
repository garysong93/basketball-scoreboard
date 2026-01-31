import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useSync } from '../hooks/useSync';
import { REFEREE_ROLES, type RefereeRole } from '../utils/refereeRoles';

interface SharePanelProps {
  onClose: () => void;
}

export function SharePanel({ onClose }: SharePanelProps) {
  const { language } = useGameStore();
  const {
    syncMode,
    syncStatus,
    gameId,
    isHost,
    isViewer,
    shareUrl,
    isFirebaseEnabled,
    refereeRole,
    startHosting,
    joinGame,
    stopSync,
    setRefereeRole,
  } = useSync();

  const [joinCode, setJoinCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<RefereeRole>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'readonly' | null>(null);

  const content = {
    en: {
      title: 'Share & Sync',
      notConfigured: 'Firebase not configured',
      notConfiguredDesc: 'To enable real-time sharing, add Firebase credentials to your environment.',
      setupInstructions: 'Setup Instructions',
      localMode: 'Local Mode',
      localModeDesc: 'Your scoreboard is running locally. Start hosting to share with others.',
      startHosting: 'Start Hosting',
      hosting: 'Hosting',
      hostingDesc: 'Share this link with viewers:',
      copyLink: 'Copy',
      copied: 'Copied!',
      readOnlyLink: 'View-Only Link',
      readOnlyDesc: 'Share for spectators',
      editLink: 'Edit Link',
      editDesc: 'Share for co-referees',
      stopHosting: 'Stop Hosting',
      viewerMode: 'Viewer Mode',
      viewerModeDesc: 'You are viewing a shared game.',
      disconnect: 'Disconnect',
      joinGame: 'Join a Game',
      joinGameDesc: 'Enter a 6-character game code:',
      gameCode: 'Game Code',
      join: 'Join',
      status: 'Status',
      connected: 'Connected',
      connecting: 'Connecting...',
      disconnected: 'Disconnected',
      error: 'Error',
      gameNotFound: 'Game not found',
      connectionError: 'Connection error',
      selectRole: 'Select Your Role',
      roleDescription: 'Choose your role to control specific functions:',
      currentRole: 'Current Role',
      changeRole: 'Change Role',
    },
    zh: {
      title: '分享与同步',
      notConfigured: 'Firebase 未配置',
      notConfiguredDesc: '要启用实时分享功能，请添加 Firebase 凭据到环境变量。',
      setupInstructions: '配置说明',
      localMode: '本地模式',
      localModeDesc: '计分板正在本地运行。开始托管以与他人分享。',
      startHosting: '开始托管',
      hosting: '托管中',
      hostingDesc: '分享此链接给观众：',
      copyLink: '复制',
      copied: '已复制！',
      readOnlyLink: '只读链接',
      readOnlyDesc: '分享给观众',
      editLink: '编辑链接',
      editDesc: '分享给协助裁判',
      stopHosting: '停止托管',
      viewerMode: '观众模式',
      viewerModeDesc: '你正在观看一个共享的比赛。',
      disconnect: '断开连接',
      joinGame: '加入比赛',
      joinGameDesc: '输入6位比赛代码：',
      gameCode: '比赛代码',
      join: '加入',
      status: '状态',
      connected: '已连接',
      connecting: '连接中...',
      disconnected: '未连接',
      error: '错误',
      gameNotFound: '未找到比赛',
      connectionError: '连接错误',
      selectRole: '选择你的角色',
      roleDescription: '选择角色以控制特定功能：',
      currentRole: '当前角色',
      changeRole: '更改角色',
    },
  };

  const t = content[language];

  const handleStartHosting = async () => {
    setIsLoading(true);
    setError(null);
    const result = await startHosting();
    setIsLoading(false);
    if (!result) {
      setError(t.connectionError);
    }
  };

  const handleJoinGame = async () => {
    if (joinCode.length !== 6) return;

    setIsLoading(true);
    setError(null);
    const success = await joinGame(joinCode.toUpperCase(), selectedRole);
    setIsLoading(false);

    if (!success) {
      setError(t.gameNotFound);
    }
  };

  const handleCopyLink = (url: string | null, type: 'readonly') => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
        return 'bg-[var(--color-success)]';
      case 'connecting':
        return 'bg-[var(--color-warning)]';
      case 'error':
        return 'bg-[var(--color-danger)]';
      default:
        return 'bg-[var(--color-text-secondary)]';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return t.connected;
      case 'connecting':
        return t.connecting;
      case 'error':
        return t.error;
      default:
        return t.disconnected;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3 sm:p-4 flex justify-between items-center bg-[var(--color-bg-secondary)]">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            🔗 {t.title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Firebase not configured warning */}
          {!isFirebaseEnabled && (
            <div className="p-4 rounded-lg bg-[var(--color-warning)]/20 border border-[var(--color-warning)]">
              <h3 className="font-semibold text-[var(--color-warning)] mb-2">
                ⚠️ {t.notConfigured}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                {t.notConfiguredDesc}
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer text-[var(--color-accent)] font-medium">
                  {t.setupInstructions}
                </summary>
                <div className="mt-2 p-3 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-mono text-xs">
                  <p className="mb-2">1. Create a Firebase project at console.firebase.google.com</p>
                  <p className="mb-2">2. Enable Realtime Database</p>
                  <p className="mb-2">3. Create a .env file with:</p>
                  <pre className="bg-black/30 p-2 rounded overflow-x-auto">
{`VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_APP_ID=your-app-id`}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Status indicator */}
          {isFirebaseEnabled && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {t.status}: <span className="text-[var(--color-text-primary)]">{getStatusText()}</span>
              </span>
              {gameId && (
                <span className="ml-auto font-mono text-sm text-[var(--color-accent)]">
                  {gameId}
                </span>
              )}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-lg bg-[var(--color-danger)]/20 text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          {/* Local mode - not hosting or viewing */}
          {isFirebaseEnabled && syncMode === 'local' && (
            <>
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                  📍 {t.localMode}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {t.localModeDesc}
                </p>
                <button
                  onClick={handleStartHosting}
                  disabled={isLoading}
                  className="w-full py-2 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? t.connecting : t.startHosting}
                </button>
              </div>

              {/* Join game */}
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                  🎮 {t.joinGame}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {t.joinGameDesc}
                </p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                    placeholder={t.gameCode}
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)] font-mono text-center text-lg tracking-wider uppercase"
                    maxLength={6}
                  />
                </div>

                {/* Role selection */}
                <div className="mb-4">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {t.selectRole}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['main_referee', 'assistant_referee', 'technical', 'viewer'] as RefereeRole[]).map((role) => {
                      const roleInfo = REFEREE_ROLES[role];
                      return (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`p-2 rounded-lg text-left transition-colors ${
                            selectedRole === role
                              ? 'bg-[var(--color-accent)] text-white'
                              : 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{roleInfo.icon}</span>
                            <span className="text-sm font-medium">
                              {roleInfo.name[language]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                    {REFEREE_ROLES[selectedRole].description[language]}
                  </p>
                </div>

                <button
                  onClick={handleJoinGame}
                  disabled={isLoading || joinCode.length !== 6}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-success)] text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {t.join}
                </button>
              </div>
            </>
          )}

          {/* Host mode */}
          {isHost && (
            <div className="p-4 rounded-lg bg-[var(--color-success)]/20 border border-[var(--color-success)]">
              <h3 className="font-semibold text-[var(--color-success)] mb-2">
                📡 {t.hosting}
              </h3>

              {/* Game code display */}
              <div className="text-center p-4 rounded-lg bg-[var(--color-bg-primary)] mb-4">
                <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                  {t.gameCode}
                </div>
                <div className="text-4xl font-mono font-bold text-[var(--color-accent)] tracking-wider">
                  {gameId}
                </div>
              </div>

              {/* View-Only Link */}
              <div className="mb-3 p-3 rounded-lg bg-[var(--color-bg-primary)]">
                <div className="flex items-center gap-2 mb-2">
                  <span>👁️</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{t.readOnlyLink}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2">{t.readOnlyDesc}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl || ''}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs font-mono"
                  />
                  <button
                    onClick={() => handleCopyLink(shareUrl, 'readonly')}
                    className="px-3 py-2 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:bg-orange-600 transition-colors text-sm"
                  >
                    {copied === 'readonly' ? t.copied : t.copyLink}
                  </button>
                </div>
              </div>

              <button
                onClick={stopSync}
                className="w-full py-2 rounded-lg font-semibold bg-[var(--color-danger)] text-white hover:bg-red-600 transition-colors"
              >
                {t.stopHosting}
              </button>
            </div>
          )}

          {/* Viewer mode */}
          {isViewer && (
            <div className="p-4 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]">
              <h3 className="font-semibold text-[var(--color-accent)] mb-2">
                {refereeRole ? REFEREE_ROLES[refereeRole].icon : '👁️'} {refereeRole ? REFEREE_ROLES[refereeRole].name[language] : t.viewerMode}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                {refereeRole ? REFEREE_ROLES[refereeRole].description[language] : t.viewerModeDesc}
              </p>

              {/* Game code display */}
              <div className="text-center p-4 rounded-lg bg-[var(--color-bg-primary)] mb-4">
                <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                  {t.gameCode}
                </div>
                <div className="text-2xl font-mono font-bold text-[var(--color-accent)] tracking-wider">
                  {gameId}
                </div>
              </div>

              {/* Role change */}
              {refereeRole && refereeRole !== 'viewer' && (
                <div className="mb-4 p-3 rounded-lg bg-[var(--color-bg-primary)]">
                  <div className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {t.changeRole}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['main_referee', 'assistant_referee', 'technical', 'viewer'] as RefereeRole[]).map((role) => {
                      const roleInfo = REFEREE_ROLES[role];
                      return (
                        <button
                          key={role}
                          onClick={() => setRefereeRole(role)}
                          className={`p-2 rounded text-left transition-colors text-sm ${
                            refereeRole === role
                              ? 'bg-[var(--color-accent)] text-white'
                              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600'
                          }`}
                        >
                          <span>{roleInfo.icon}</span> {roleInfo.name[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={stopSync}
                className="w-full py-2 rounded-lg font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600 transition-colors"
              >
                {t.disconnect}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
