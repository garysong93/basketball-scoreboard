import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGameStore } from '../stores/gameStore';
import { Header } from '../components/Header';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQPage() {
  const { language } = useGameStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const seoContent = {
    en: {
      title: 'FAQ - Basketball Scoreboard Help & Support | Basketball Scoreboard',
      description: 'Frequently asked questions about Basketball Scoreboard. Learn about features, keyboard shortcuts, OBS streaming, offline mode, and more.',
    },
    zh: {
      title: '常见问题 - 篮球计分板帮助与支持 | 篮球计分板',
      description: '篮球计分板常见问题解答。了解功能特性、键盘快捷键、OBS直播、离线模式等。',
    },
  };

  const content = {
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about Basketball Scoreboard',
      allCategories: 'All',
      categories: ['General', 'Features', 'Technical', 'Streaming'],

      faqs: [
        {
          category: 'General',
          question: 'Is this scoreboard really free?',
          answer: 'Yes, 100% free! No ads, no subscriptions, no hidden fees. The app is open source and will always remain free.',
        },
        {
          category: 'General',
          question: 'Do I need to create an account?',
          answer: 'No account required. Just open the app and start scoring. Your game data is saved locally in your browser.',
        },
        {
          category: 'General',
          question: 'What basketball rules are supported?',
          answer: 'We support FIBA (international), NBA, NCAA (college), and 3x3 basketball rules. Each preset automatically configures quarter length, shot clock, foul limits, and timeouts.',
        },
        {
          category: 'General',
          question: 'Can I use this for youth/recreational leagues?',
          answer: 'Absolutely! You can customize the rules or use the "Custom" preset to set your own quarter lengths, shot clock times, and foul limits.',
        },
        {
          category: 'Features',
          question: 'How do keyboard shortcuts work?',
          answer: 'Press 1/2/3 for home team points, 7/8/9 for away team points, Space to start/stop timer, R for shot clock reset, F for fouls. See the Tutorial page for the complete list.',
        },
        {
          category: 'Features',
          question: 'Can I track individual player statistics?',
          answer: 'Yes! Click "Player Stats" to track each player\'s points, fouls, assists, rebounds, steals, blocks, and turnovers. You can also mark which players are currently on court.',
        },
        {
          category: 'Features',
          question: 'What does the bonus/double bonus indicator mean?',
          answer: 'When a team commits enough fouls in a period, the opposing team enters "bonus" and gets free throws on non-shooting fouls. The number of fouls varies by rule set.',
        },
        {
          category: 'Features',
          question: 'Can I undo a mistake?',
          answer: 'Yes! Press Ctrl+Z (or Cmd+Z on Mac) to undo. You can also use the -1 button to subtract a point if you added too many.',
        },
        {
          category: 'Technical',
          question: 'Does it work offline?',
          answer: 'Yes! This is a PWA (Progressive Web App) that works fully offline. Install it on your device for the best experience - it will work even with no internet.',
        },
        {
          category: 'Technical',
          question: 'How do I install it on my phone/tablet?',
          answer: 'On iOS: Use Safari, tap Share, then "Add to Home Screen". On Android: Use Chrome, tap the menu, then "Install app" or "Add to Home Screen".',
        },
        {
          category: 'Technical',
          question: 'Will my game data be saved if I close the browser?',
          answer: 'Yes, your current game and settings are automatically saved to your browser\'s local storage. When you return, everything will be as you left it.',
        },
        {
          category: 'Technical',
          question: 'What browsers are supported?',
          answer: 'All modern browsers work great: Chrome, Firefox, Safari, Edge. For the best experience with PWA features, we recommend Chrome.',
        },
        {
          category: 'Streaming',
          question: 'How do I add the scoreboard to OBS?',
          answer: 'Click "Copy OBS Link", then in OBS add a Browser Source and paste the link. The overlay has a transparent background so it layers nicely over your video.',
        },
        {
          category: 'Streaming',
          question: 'Can I customize the OBS overlay appearance?',
          answer: 'The overlay automatically uses your team colors and names. Visit /obs for the standard overlay or /obs-minimal for a more compact version.',
        },
        {
          category: 'Streaming',
          question: 'Does the OBS overlay update in real-time?',
          answer: 'Yes! Any changes you make on the main scoreboard are instantly reflected in the OBS overlay. Both share the same data source.',
        },
        {
          category: 'Technical',
          question: 'Can multiple people control the same scoreboard?',
          answer: 'Currently each device runs independently. Multi-device sync is coming soon! For now, designate one person as the scorekeeper.',
        },
      ] as FAQItem[],
    },

    zh: {
      title: '常见问题',
      subtitle: '关于篮球计分板您需要知道的一切',
      allCategories: '全部',
      categories: ['常规', '功能', '技术', '直播'],

      faqs: [
        {
          category: '常规',
          question: '这个计分板真的免费吗？',
          answer: '是的，100%免费！没有广告、没有订阅、没有隐藏费用。这个应用是开源的，将永远保持免费。',
        },
        {
          category: '常规',
          question: '需要创建账号吗？',
          answer: '不需要账号。直接打开应用就可以开始记分。您的比赛数据保存在浏览器本地。',
        },
        {
          category: '常规',
          question: '支持哪些篮球规则？',
          answer: '我们支持FIBA（国际篮联）、NBA、NCAA（大学）和3x3篮球规则。每个预设会自动配置节长、进攻时间、犯规限制和暂停次数。',
        },
        {
          category: '常规',
          question: '可以用于青少年/业余联赛吗？',
          answer: '当然可以！您可以自定义规则或使用"自定义"预设来设置自己的节长、进攻时间和犯规限制。',
        },
        {
          category: '功能',
          question: '键盘快捷键怎么用？',
          answer: '按1/2/3给主队加分，按7/8/9给客队加分，空格键启停计时器，R重置进攻时间，F记录犯规。完整列表请查看教程页面。',
        },
        {
          category: '功能',
          question: '可以追踪球员个人数据吗？',
          answer: '可以！点击"球员统计"追踪每位球员的得分、犯规、助攻、篮板、抢断、盖帽和失误。还可以标记哪些球员目前在场上。',
        },
        {
          category: '功能',
          question: '罚球/双罚指示器是什么意思？',
          answer: '当一支球队在一节内犯规达到一定次数后，对方进入"罚球"状态，非投篮犯规也要罚球。具体犯规次数因规则而异。',
        },
        {
          category: '功能',
          question: '操作错误可以撤销吗？',
          answer: '可以！按Ctrl+Z（Mac上是Cmd+Z）撤销。如果加分过多，也可以用-1按钮减分。',
        },
        {
          category: '技术',
          question: '离线可以用吗？',
          answer: '可以！这是一个PWA（渐进式网页应用），完全支持离线使用。将它安装到设备上获得最佳体验——即使没有网络也能正常工作。',
        },
        {
          category: '技术',
          question: '怎么安装到手机/平板？',
          answer: 'iOS：使用Safari，点击分享按钮，然后选择"添加到主屏幕"。Android：使用Chrome，点击菜单，选择"安装应用"或"添加到主屏幕"。',
        },
        {
          category: '技术',
          question: '关闭浏览器后比赛数据会保存吗？',
          answer: '会的，当前比赛和设置会自动保存到浏览器本地存储。当您返回时，一切都会保持原样。',
        },
        {
          category: '技术',
          question: '支持哪些浏览器？',
          answer: '所有现代浏览器都可以使用：Chrome、Firefox、Safari、Edge。为获得最佳PWA体验，我们推荐使用Chrome。',
        },
        {
          category: '直播',
          question: '怎么把计分板添加到OBS？',
          answer: '点击"复制OBS链接"，然后在OBS中添加浏览器源并粘贴链接。叠加层是透明背景的，可以很好地覆盖在视频上。',
        },
        {
          category: '直播',
          question: '可以自定义OBS叠加层外观吗？',
          answer: '叠加层会自动使用您设置的队伍颜色和名称。访问/obs获取标准叠加层，或/obs-minimal获取更紧凑的版本。',
        },
        {
          category: '直播',
          question: 'OBS叠加层是实时更新的吗？',
          answer: '是的！您在主计分板上做的任何更改都会立即反映在OBS叠加层中。两者共享同一数据源。',
        },
        {
          category: '技术',
          question: '多人可以同时控制一个计分板吗？',
          answer: '目前每个设备独立运行。多设备同步功能即将推出！现在请指定一人作为记分员。',
        },
      ] as FAQItem[],
    },
  };

  const c = content[language];

  const filteredFaqs = activeCategory === 'all'
    ? c.faqs
    : c.faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Helmet>
        <title>{seoContent[language].title}</title>
        <meta name="title" content={seoContent[language].title} />
        <meta name="description" content={seoContent[language].description} />
        <link rel="canonical" href="https://www.basketballscoreboardonline.com/faq" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.basketballscoreboardonline.com/faq" />
        <meta property="og:title" content={seoContent[language].title} />
        <meta property="og:description" content={seoContent[language].description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.basketballscoreboardonline.com/faq" />
        <meta name="twitter:title" content={seoContent[language].title} />
        <meta name="twitter:description" content={seoContent[language].description} />
      </Helmet>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {c.title}
          </h1>
          <p className="text-xl text-[var(--color-accent)]">
            {c.subtitle}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-slate-600'
            }`}
          >
            {c.allCategories}
          </button>
          {c.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-medium text-[var(--color-text-primary)] pr-4">
                  {faq.question}
                </span>
                <span
                  className={`text-[var(--color-accent)] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick start CTA */}
        <div className="mt-8 text-center">
          <a
            href="/app"
            className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            {language === 'en' ? 'Start Using Scoreboard' : '开始使用计分板'}
          </a>
        </div>
      </main>

      <footer className="bg-[var(--color-bg-secondary)] mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-[var(--color-text-secondary)]">
          <p>© 2024 Basketball Scoreboard Online. {language === 'en' ? 'Free & Open Source.' : '免费开源。'}</p>
        </div>
      </footer>
    </div>
  );
}
