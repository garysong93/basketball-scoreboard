import { useGameStore } from '../stores/gameStore';

export function FeaturesSection() {
  const { language } = useGameStore();

  const content = {
    en: {
      features: [
        { icon: '🏀', title: 'Free scorekeeping', desc: '100% free, no registration required' },
        { icon: '⚡', title: 'Real-time updates', desc: 'Instant score synchronization' },
        { icon: '📱', title: 'Any device', desc: 'Works on phones, tablets & desktops' },
        { icon: '📺', title: 'OBS ready', desc: 'Built-in streaming overlay' },
      ],
    },
    zh: {
      features: [
        { icon: '🏀', title: '免费记分', desc: '100% 免费，无需注册' },
        { icon: '⚡', title: '实时更新', desc: '即时同步比分' },
        { icon: '📱', title: '全设备支持', desc: '手机、平板、电脑均可使用' },
        { icon: '📺', title: 'OBS 支持', desc: '内置直播叠加层' },
      ],
    },
  };

  const t = content[language];

  return (
    <section id="features-section" className="bg-[var(--color-bg-secondary)] py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {t.features.map((feature, index) => (
            <div key={index} className="text-center w-32">
              <div className="w-14 h-14 mx-auto mb-3 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <h3 className="font-bold text-[var(--color-text-primary)] mb-1 text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
