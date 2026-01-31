import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export function QuickHelp() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useGameStore();

  const content = {
    en: {
      button: 'How to use this scoreboard?',
      title: 'Quick Start Guide',
      tips: [
        { icon: '🎯', label: 'Score', desc: 'Click +1/+2/+3 or press 1,2,3 (home) / 7,8,9 (away)' },
        { icon: '⏱️', label: 'Timer', desc: 'Press Space to start/pause the game clock' },
        { icon: '⚙️', label: 'Settings', desc: 'Click the orange Settings button to set team names and rules' },
        { icon: '⌨️', label: 'Shortcuts', desc: 'Keyboard shortcuts available for faster operation' },
      ],
      fullTutorial: 'View full tutorial',
      close: 'Close',
    },
    zh: {
      button: '如何使用计分板?',
      title: '快速入门指南',
      tips: [
        { icon: '🎯', label: '得分', desc: '点击 +1/+2/+3 或按 1,2,3（主队）/ 7,8,9（客队）' },
        { icon: '⏱️', label: '计时', desc: '按空格键开始/暂停比赛计时' },
        { icon: '⚙️', label: '设置', desc: '点击橙色的设置按钮来设置队名和规则' },
        { icon: '⌨️', label: '快捷键', desc: '支持键盘快捷键，操作更快捷' },
      ],
      fullTutorial: '查看完整教程',
      close: '关闭',
    },
  };

  const t = content[language];

  return (
    <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-primary)]">
      {!isExpanded ? (
        // Collapsed state - single line button
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full px-4 py-2 flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-primary)]/50 transition-colors"
        >
          <span>❓</span>
          <span>{t.button}</span>
        </button>
      ) : (
        // Expanded state - help card
        <div className="max-w-4xl mx-auto px-4 py-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              {t.title}
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={t.close}
            >
              ✕
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {t.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="flex-shrink-0">{tip.icon}</span>
                <div className="text-sm">
                  <span className="font-medium text-[var(--color-text-primary)]">{tip.label}: </span>
                  <span className="text-[var(--color-text-secondary)]">{tip.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/tutorial"
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              {t.fullTutorial} →
            </a>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm px-3 py-1 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
