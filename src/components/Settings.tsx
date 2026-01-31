import { useGameStore } from '../stores/gameStore';
import { translations, type Language } from '../i18n';
import { RULE_PRESETS, type RuleSet } from '../utils/rules';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const {
    rules,
    language,
    theme,
    home,
    away,
    setRules,
    setLanguage,
    setTheme,
    setTeamName,
    setTeamColor,
    newGame,
  } = useGameStore();

  const t = translations[language];

  const handleNewGame = () => {
    if (window.confirm(t.confirmNewGame)) {
      newGame();
      onClose();
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
            {t.settings}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              {t.language}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)]"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              {t.theme}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                }`}
              >
                🌙 {t.dark}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  theme === 'light'
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                }`}
              >
                ☀️ {t.light}
              </button>
            </div>
          </div>

          {/* Rules preset */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              {t.rules}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RULE_PRESETS) as RuleSet[]).map((ruleSet) => (
                <button
                  key={ruleSet}
                  onClick={() => setRules(ruleSet)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    rules.name === ruleSet
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-slate-600'
                  }`}
                >
                  {ruleSet === '3x3' ? t.threeOnThree : t[ruleSet as keyof typeof t] || ruleSet.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Current rules info */}
          <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)] text-sm">
            <div className="grid grid-cols-2 gap-2 text-[var(--color-text-secondary)]">
              <div>{t.periodLength}: <span className="text-[var(--color-text-primary)]">{rules.periodLength / 60} min</span></div>
              <div>{t.period}: <span className="text-[var(--color-text-primary)]">{rules.periodCount}</span></div>
              <div>{t.shotClock}: <span className="text-[var(--color-text-primary)]">{rules.shotClock}s</span></div>
              <div>{t.fouls} (Bonus): <span className="text-[var(--color-text-primary)]">{rules.bonusFouls}</span></div>
            </div>
          </div>

          {/* Team names */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              {t.homeTeam}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={home.name}
                onChange={(e) => setTeamName('home', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)]"
              />
              <input
                type="color"
                value={home.color}
                onChange={(e) => setTeamColor('home', e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              {t.awayTeam}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={away.name}
                onChange={(e) => setTeamName('away', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)]"
              />
              <input
                type="color"
                value={away.color}
                onChange={(e) => setTeamColor('away', e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* New game button */}
          <button
            onClick={handleNewGame}
            className="w-full px-4 py-3 rounded-lg font-semibold bg-[var(--color-danger)] text-white hover:bg-red-600 transition-colors"
          >
            {t.newGame}
          </button>
        </div>
      </div>
    </div>
  );
}
