import { useGameStore } from '../stores/gameStore';

export function SEOContentSection() {
  const { language } = useGameStore();

  const content = {
    en: {
      mainTitle: 'The Free Basketball Scoreboard for Every Game',
      mainDescription: 'Whether you\'re running a local rec league, coaching youth basketball, or streaming NCAA March Madness watch parties, this free online basketball scoreboard has everything you need. No downloads, no sign-ups—just open and start scoring.',

      sections: [
        {
          title: 'Perfect for Every Level of Play',
          description: 'Pre-configured rule sets for FIBA international games, NBA professional rules, NCAA college basketball, and 3x3 street ball. Each preset automatically adjusts quarter lengths, shot clock timing, foul limits, and timeout rules. Or create your own custom settings for recreational leagues and youth tournaments.',
        },
        {
          title: 'Built for Live Streaming',
          description: 'Add a professional basketball overlay to your OBS, Streamlabs, or any streaming software. The transparent background scoreboard overlay displays real-time scores, game clock, and shot clock—perfect for YouTube, Twitch, or Facebook Live broadcasts of your games.',
        },
        {
          title: 'Works Anywhere, Even Offline',
          description: 'Install this progressive web app on any device and use it without internet. Your game data saves locally and syncs when you\'re back online. Perfect for gyms with spotty WiFi or outdoor courts with no connection.',
        },
        {
          title: 'Track More Than Just the Score',
          description: 'Full player statistics tracking including points, assists, rebounds, steals, blocks, and turnovers. Monitor individual fouls, track who\'s on court, and keep detailed game records. Export stats after the game for team analysis.',
        },
      ],

      features: [
        { icon: '⏱️', title: 'Game Timer', desc: 'Configurable period lengths with automatic buzzer' },
        { icon: '🏀', title: 'Shot Clock', desc: 'NBA 24-sec, FIBA 24-sec, or custom timing' },
        { icon: '📊', title: 'Player Stats', desc: 'Points, assists, rebounds, and more per player' },
        { icon: '⚠️', title: 'Foul Tracking', desc: 'Personal fouls with bonus indicator' },
        { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Score quickly without touching the screen' },
        { icon: '🎙️', title: 'Voice Control', desc: 'Hands-free scoring for solo scorekeepers' },
      ],
    },
    zh: {
      mainTitle: '适用于所有比赛的免费篮球计分板',
      mainDescription: '无论是运营本地业余联赛、执教青少年篮球，还是直播 NCAA 疯狂三月观赛派对，这款免费在线篮球计分板都能满足您的需求。无需下载、无需注册——打开即用。',

      sections: [
        {
          title: '适配各级别比赛',
          description: '预设 FIBA 国际赛规则、NBA 职业规则、NCAA 大学篮球规则和 3x3 街球规则。每个预设自动调整节长、进攻时间、犯规限制和暂停规则。也可以为业余联赛和青少年比赛创建自定义设置。',
        },
        {
          title: '专为直播打造',
          description: '为您的 OBS、Streamlabs 或任何直播软件添加专业篮球叠加层。透明背景的计分板实时显示比分、比赛时间和进攻时间——完美适配 YouTube、Twitch 或 Facebook Live 的比赛直播。',
        },
        {
          title: '随处可用，离线也行',
          description: '在任何设备上安装这款渐进式网页应用，无需网络即可使用。比赛数据本地保存，联网后自动同步。非常适合 WiFi 信号不稳定的体育馆或没有网络的户外球场。',
        },
        {
          title: '不只是记分',
          description: '完整的球员数据追踪，包括得分、助攻、篮板、抢断、盖帽和失误。监控个人犯规，追踪场上球员，保存详细比赛记录。赛后可导出数据用于球队分析。',
        },
      ],

      features: [
        { icon: '⏱️', title: '比赛计时', desc: '可配置的节长和自动蜂鸣器' },
        { icon: '🏀', title: '进攻时间', desc: 'NBA 24秒、FIBA 24秒或自定义时间' },
        { icon: '📊', title: '球员统计', desc: '每位球员的得分、助攻、篮板等数据' },
        { icon: '⚠️', title: '犯规追踪', desc: '个人犯规及罚球指示' },
        { icon: '⌨️', title: '键盘快捷键', desc: '无需触屏即可快速记分' },
        { icon: '🎙️', title: '语音控制', desc: '单人记分员的解放双手方案' },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-16 bg-[var(--color-bg-secondary)]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            {t.mainTitle}
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            {t.mainDescription}
          </p>
        </div>

        {/* Content sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {t.sections.map((section, index) => (
            <div key={index} className="bg-[var(--color-bg-primary)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                {section.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-[var(--color-bg-primary)] rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="font-medium text-[var(--color-text-primary)] text-sm mb-1">
                {feature.title}
              </h4>
              <p className="text-[var(--color-text-secondary)] text-xs">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
