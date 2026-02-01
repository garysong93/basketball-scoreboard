import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { language } = useGameStore();
  const t = translations[language];

  const navLinks = [
    { href: '/', label: { en: 'Scoreboard', zh: '计分板' }, icon: '🏀' },
    { href: '/rules', label: { en: 'Basketball Rules', zh: '篮球规则' }, icon: '📋' },
    { href: '/tutorial', label: { en: 'How to Use', zh: '使用教程' }, icon: '📖' },
    { href: '/faq', label: { en: 'FAQ', zh: '常见问题' }, icon: '❓' },
  ];

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-72 bg-[var(--color-bg-secondary)] shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-bg-primary)]">
          <span className="font-bold text-lg text-[var(--color-text-primary)]">
            {t.appName}
          </span>
          <button
            onClick={onClose}
            className="p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          {navLinks.map((link) => {
            const isActive = window.location.pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 min-h-[56px] text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-r-4 border-[var(--color-accent)]'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
                onClick={onClose}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label[language]}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
