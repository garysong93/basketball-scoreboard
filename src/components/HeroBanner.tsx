import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

const STORAGE_KEY = 'heroBannerDismissed';

export function HeroBanner() {
  const { language } = useGameStore();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const content = {
    en: {
      title: 'Free Online Basketball Scoreboard',
      subtitle: 'Track scores, fouls, and timeouts in real-time. No registration required.',
      learnMore: 'Learn more',
    },
    zh: {
      title: '免费在线篮球计分板',
      subtitle: '实时记录比分、犯规和暂停。无需注册，即刻使用。',
      learnMore: '了解更多',
    },
  };

  const t = content[language];

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold truncate">
            {t.title}
          </h1>
          <p className="text-sm text-slate-300 hidden sm:block">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={scrollToFeatures}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap hidden md:block"
          >
            {t.learnMore} ↓
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
