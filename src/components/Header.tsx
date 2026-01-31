import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const { language } = useGameStore();
  const t = translations[language];

  const navLinks = [
    { href: '/', label: { en: 'Scoreboard', zh: '计分板' } },
    { href: '/rules', label: { en: 'Basketball Rules', zh: '篮球规则' } },
    { href: '/tutorial', label: { en: 'How to Use', zh: '使用教程' } },
    { href: '/faq', label: { en: 'FAQ', zh: '常见问题' } },
  ];

  return (
    <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xl sm:text-2xl">🏀</span>
          <span className="font-bold text-sm sm:text-lg text-[var(--color-text-primary)] truncate">
            {t.appName}
          </span>
        </a>

        {showNav && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${
                  window.location.pathname === link.href
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {link.label[language]}
              </a>
            ))}
          </nav>
        )}

      </div>

      {/* Mobile nav */}
      {showNav && (
        <nav className="md:hidden flex items-center gap-4 px-4 pb-3 overflow-x-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-[var(--color-accent)] ${
                window.location.pathname === link.href
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              {link.label[language]}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
