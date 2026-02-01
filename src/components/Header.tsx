import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { MobileDrawer } from './MobileDrawer';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const { language } = useGameStore();
  const t = translations[language];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { href: '/', label: { en: 'Scoreboard', zh: '计分板' } },
    { href: '/rules', label: { en: 'Basketball Rules', zh: '篮球规则' } },
    { href: '/tutorial', label: { en: 'How to Use', zh: '使用教程' } },
    { href: '/faq', label: { en: 'FAQ', zh: '常见问题' } },
  ];

  return (
    <>
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xl sm:text-2xl">🏀</span>
            <span className="font-bold text-sm sm:text-lg text-[var(--color-text-primary)] truncate">
              {t.appName}
            </span>
          </a>

          {/* Desktop navigation */}
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

          {/* Mobile hamburger menu button */}
          {showNav && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
