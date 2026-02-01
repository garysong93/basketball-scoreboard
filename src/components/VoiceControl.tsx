import { useVoiceControl } from '../hooks/useVoiceControl';
import { useGameStore } from '../stores/gameStore';

export function VoiceControl() {
  const { language } = useGameStore();

  const {
    isListening,
    isSupported,
    lastCommand,
    error,
    toggleListening,
  } = useVoiceControl();

  if (!isSupported) {
    return null; // Don't show if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-4 py-2 rounded-l-lg font-medium transition-all ${
          isListening
            ? 'bg-[var(--color-danger)] text-white animate-pulse'
            : 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-slate-700'
        }`}
        title={isListening
          ? (language === 'en' ? 'Stop listening' : '停止聆听')
          : (language === 'en' ? 'Start voice control' : '开始语音控制')
        }
      >
        <span className="text-lg">{isListening ? '🔴' : '🎤'}</span>
        <span className="hidden sm:inline">
          {isListening
            ? (language === 'en' ? 'Listening...' : '聆听中...')
            : (language === 'en' ? 'Voice' : '语音')
          }
        </span>
      </button>

      {/* Feedback display */}
      {(lastCommand || error) && (
        <div
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            error
              ? 'bg-[var(--color-danger)] text-white'
              : 'bg-[var(--color-success)] text-white'
          }`}
        >
          {error || lastCommand}
        </div>
      )}
    </div>
  );
}

// Voice commands help modal
interface VoiceHelpProps {
  onClose: () => void;
}

export function VoiceHelp({ onClose }: VoiceHelpProps) {
  const { language } = useGameStore();
  const { isListening, isSupported, toggleListening, lastCommand, error } = useVoiceControl();

  const commands = {
    en: [
      { category: 'Scoring', commands: [
        '"Home plus one" / "Home two" / "Home three"',
        '"Away plus one" / "Away two" / "Away three"',
        '"Home minus one" / "Away minus one"',
      ]},
      { category: 'Timer', commands: [
        '"Start" / "Stop" / "Pause"',
        '"Reset clock" / "24 seconds" / "14 seconds"',
      ]},
      { category: 'Fouls & Timeouts', commands: [
        '"Home foul" / "Away foul"',
        '"Home timeout" / "Away timeout"',
      ]},
      { category: 'Possession', commands: [
        '"Home ball" / "Away ball"',
        '"Switch possession"',
      ]},
      { category: 'Period', commands: [
        '"Next period" / "Next quarter"',
      ]},
    ],
    zh: [
      { category: '得分', commands: [
        '"主队加一分" / "主队两分" / "主队三分"',
        '"客队加一分" / "客队两分" / "客队三分"',
        '"主队减一分" / "客队减一分"',
      ]},
      { category: '计时器', commands: [
        '"开始" / "停止" / "暂停计时"',
        '"重置进攻时间" / "24秒" / "14秒"',
      ]},
      { category: '犯规与暂停', commands: [
        '"主队犯规" / "客队犯规"',
        '"主队暂停" / "客队暂停"',
      ]},
      { category: '球权', commands: [
        '"主队球权" / "客队球权"',
        '"切换球权"',
      ]},
      { category: '节数', commands: [
        '"下一节"',
      ]},
    ],
  };

  const c = commands[language];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] w-full sm:max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3 sm:p-4 flex justify-between items-center gap-3 bg-[var(--color-bg-secondary)]">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            🎤 {language === 'en' ? 'Voice Commands' : '语音命令'}
          </h2>

          {/* Voice control button */}
          <div className="flex items-center gap-2">
            {isSupported ? (
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                  isListening
                    ? 'bg-[var(--color-danger)] text-white animate-pulse'
                    : 'bg-[var(--color-success)] text-white hover:bg-green-600'
                }`}
              >
                <span>{isListening ? '🔴' : '▶️'}</span>
                <span>
                  {isListening
                    ? (language === 'en' ? 'Stop' : '停止')
                    : (language === 'en' ? 'Start' : '开始')
                  }
                </span>
              </button>
            ) : (
              <span className="text-yellow-500 text-sm px-2">
                {language === 'en' ? '⚠️ Not supported' : '⚠️ 浏览器不支持'}
              </span>
            )}
            <button
              onClick={onClose}
              className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status feedback */}
        {isSupported && (lastCommand || error) && (
          <div className={`mx-3 sm:mx-4 mt-3 px-3 py-2 rounded-lg text-sm font-medium ${
            error
              ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]'
              : 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
          }`}>
            {error || (language === 'en' ? `✓ ${lastCommand}` : `✓ ${lastCommand}`)}
          </div>
        )}

        {/* Commands list */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {c.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-[var(--color-accent)] mb-2">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.commands.map((cmd, cmdIndex) => (
                  <div
                    key={cmdIndex}
                    className="px-3 py-2 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm"
                  >
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-sm">
            {language === 'en'
              ? '💡 Tip: Speak clearly and wait for the feedback before the next command.'
              : '💡 提示：请清晰地说出命令，等待反馈后再说下一条命令。'
            }
          </div>

          {/* Browser support note */}
          <div className="mt-3 p-3 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm">
            {language === 'en'
              ? '💻 Voice control requires browser support and microphone permission. Works best on Chrome desktop.'
              : '💻 语音控制需要浏览器支持和麦克风权限，在电脑端 Chrome 浏览器效果最佳。'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
