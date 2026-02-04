import { useGameStore } from '../stores/gameStore';

export function Footer() {
  const { language } = useGameStore();

  const content = {
    en: {
      tagline: 'Free & Open Source Basketball Scoreboard',
      product: 'Product',
      resources: 'Resources',
      scoreboard: 'Scoreboard',
      obsOverlay: 'OBS Overlay',
      rules: 'Basketball Rules',
      tutorial: 'How to Use',
      faq: 'FAQ',
      feedback: 'Feedback',
    },
    zh: {
      tagline: '免费开源篮球计分板',
      product: '产品',
      resources: '资源',
      scoreboard: '计分板',
      obsOverlay: 'OBS 叠加层',
      rules: '篮球规则',
      tutorial: '使用教程',
      faq: '常见问题',
      feedback: '反馈',
    },
  };

  const t = content[language];

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏀</span>
              <span className="font-bold">Basketball Scoreboard Online</span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {t.tagline}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3">{t.product}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                  {t.scoreboard}
                </a>
              </li>
              <li>
                <a href="/obs" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                  {t.obsOverlay}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">{t.resources}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/rules" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                  {t.rules}
                </a>
              </li>
              <li>
                <a href="/tutorial" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                  {t.tutorial}
                </a>
              </li>
              <li>
                <a href="/faq" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                  {t.faq}
                </a>
              </li>
              <li>
                <button
                  data-tally-open="D4zPNR"
                  data-tally-emoji-text="👋"
                  data-tally-emoji-animation="wave"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                >
                  {t.feedback}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-bg-primary)] text-center text-sm text-[var(--color-text-secondary)]">
          © {new Date().getFullYear()} Basketball Scoreboard Online. Free & Open Source.
        </div>
      </div>
    </footer>
  );
}
