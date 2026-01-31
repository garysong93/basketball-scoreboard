import { translations } from '../i18n';
import { useGameStore } from '../stores/gameStore';

interface KeyboardHelpProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '1', description: { en: 'Home team +1 point', zh: '主队+1分' } },
  { key: '2', description: { en: 'Home team +2 points', zh: '主队+2分' } },
  { key: '3', description: { en: 'Home team +3 points', zh: '主队+3分' } },
  { key: 'Shift + 1', description: { en: 'Home team -1 point', zh: '主队-1分' } },
  { key: '7', description: { en: 'Away team +1 point', zh: '客队+1分' } },
  { key: '8', description: { en: 'Away team +2 points', zh: '客队+2分' } },
  { key: '9', description: { en: 'Away team +3 points', zh: '客队+3分' } },
  { key: 'Shift + 7', description: { en: 'Away team -1 point', zh: '客队-1分' } },
  { key: 'Space', description: { en: 'Start/Pause timer', zh: '开始/暂停计时器' } },
  { key: 'R', description: { en: 'Reset shot clock (24s)', zh: '重置进攻时间(24秒)' } },
  { key: 'Shift + R', description: { en: 'Reset shot clock (14s)', zh: '重置进攻时间(14秒)' } },
  { key: 'F', description: { en: 'Home team foul', zh: '主队犯规' } },
  { key: 'Shift + F', description: { en: 'Away team foul', zh: '客队犯规' } },
  { key: 'T', description: { en: 'Home team timeout', zh: '主队暂停' } },
  { key: 'Shift + T', description: { en: 'Away team timeout', zh: '客队暂停' } },
  { key: 'Q', description: { en: 'Home possession', zh: '主队球权' } },
  { key: 'W', description: { en: 'Away possession', zh: '客队球权' } },
  { key: 'P', description: { en: 'Toggle possession', zh: '切换球权' } },
  { key: 'N', description: { en: 'Next period', zh: '下一节' } },
  { key: 'Escape', description: { en: 'Toggle fullscreen', zh: '切换全屏' } },
  { key: 'Ctrl + Z', description: { en: 'Undo', zh: '撤销' } },
  { key: 'Ctrl + Y', description: { en: 'Redo', zh: '重做' } },
];

export function KeyboardHelp({ onClose }: KeyboardHelpProps) {
  const { language } = useGameStore();
  const t = translations[language];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] w-full sm:max-w-lg h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3 sm:p-4 flex justify-between items-center bg-[var(--color-bg-secondary)]">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            ⌨️ {t.keyboardShortcuts}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="space-y-2">
            {SHORTCUTS.map(({ key, description }) => (
              <div
                key={key}
                className="flex justify-between items-center p-2 rounded-lg bg-[var(--color-bg-secondary)]"
              >
                <span className="text-[var(--color-text-secondary)]">
                  {description[language]}
                </span>
                <kbd className="px-2 py-1 rounded bg-[var(--color-bg-primary)] text-[var(--color-accent)] font-mono text-sm border border-[var(--color-text-secondary)]">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
