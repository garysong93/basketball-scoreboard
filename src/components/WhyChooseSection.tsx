import { useGameStore } from '../stores/gameStore';

export function WhyChooseSection() {
  const { language } = useGameStore();

  const content = {
    en: {
      title: 'Why choose our Basketball Scoreboard?',
      intro: "Our basketball scoreboard is a powerful, free online application designed specifically for basketball games. It's flexible, easy to use, and meets all your scoring needs.",
      points: [
        {
          title: 'Complete basketball features',
          desc: 'Score tracking, game timer, shot clock, fouls, timeouts, and player statistics - everything you need for a professional basketball game.'
        },
        {
          title: 'Works offline',
          desc: "After loading once, the scoreboard works completely offline. Your game data is saved locally and syncs when you're back online."
        },
        {
          title: 'Live streaming support',
          desc: 'Built-in OBS overlay with transparent background. Perfect for streaming games on YouTube, Twitch, or any platform.'
        },
        {
          title: 'Multiple rule sets',
          desc: 'Pre-configured rules for FIBA, NBA, NCAA, and 3x3 basketball. Or customize your own settings for any league.'
        },
      ],
    },
    zh: {
      title: '为什么选择我们的篮球计分板？',
      intro: '我们的篮球计分板是一款功能强大的免费在线应用，专为篮球比赛设计。灵活易用，满足您所有的计分需求。',
      points: [
        {
          title: '完整的篮球功能',
          desc: '比分追踪、比赛计时、进攻倒计时、犯规记录、暂停管理和球员统计 - 专业篮球比赛所需的一切。'
        },
        {
          title: '离线可用',
          desc: '加载一次后，计分板完全离线工作。比赛数据本地保存，联网后自动同步。'
        },
        {
          title: '直播支持',
          desc: '内置透明背景的 OBS 叠加层，适合在 YouTube、Twitch 或任何平台直播比赛。'
        },
        {
          title: '多种规则设置',
          desc: '预设 FIBA、NBA、NCAA 和 3x3 篮球规则。也可自定义设置适应任何联赛。'
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-16 bg-[var(--color-bg-primary)]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 md:p-12 shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-4 text-center">
            {t.title}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6 text-center max-w-2xl mx-auto text-sm">
            {t.intro}
          </p>

          <div className="space-y-4">
            {t.points.map((point, index) => (
              <div key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h4 className="font-semibold text-[var(--color-text-primary)] text-sm">{point.title}</h4>
                  <p className="text-[var(--color-text-secondary)] mt-0.5 text-sm">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
