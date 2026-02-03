import { Helmet } from 'react-helmet-async';
import { useGameStore } from '../stores/gameStore';
import { Header } from '../components/Header';

export function RulesPage() {
  const { language } = useGameStore();

  const seoContent = {
    en: {
      title: 'Basketball Rules Guide - FIBA, NBA, NCAA Rules Explained | Basketball Scoreboard',
      description: 'Complete basketball rules guide covering FIBA, NBA, NCAA and 3x3 rules. Learn scoring, fouls, violations, shot clock, and game procedures for all major basketball leagues.',
    },
    zh: {
      title: '篮球规则指南 - FIBA、NBA、NCAA 规则详解 | 篮球计分板',
      description: '完整篮球规则指南，涵盖 FIBA、NBA、NCAA 和 3x3 规则。学习得分、犯规、违例、进攻时间和比赛程序。',
    },
  };

  const content = {
    en: {
      title: 'Basketball Rules Guide',
      subtitle: 'Complete guide to FIBA, NBA, NCAA, and 3x3 basketball rules',
      intro: 'Understanding the differences between basketball rule sets is essential for players, coaches, and scorekeepers. This guide covers the major rule variations you need to know.',

      sections: [
        {
          id: 'fiba',
          title: 'FIBA Rules (International)',
          description: 'Used in Olympics, World Cup, and most international competitions',
          rules: [
            { label: 'Game Length', value: '4 quarters × 10 minutes = 40 minutes' },
            { label: 'Shot Clock', value: '24 seconds (reset to 14 after offensive rebound)' },
            { label: 'Three-Point Line', value: '6.75 meters (22.15 feet)' },
            { label: 'Team Fouls', value: '5 fouls per quarter triggers bonus free throws' },
            { label: 'Personal Fouls', value: '5 fouls = disqualification' },
            { label: 'Timeouts', value: '2 in first half, 3 in second half, 1 per overtime' },
            { label: 'Overtime', value: '5 minutes per overtime period' },
          ],
        },
        {
          id: 'nba',
          title: 'NBA Rules',
          description: 'Professional basketball in North America',
          rules: [
            { label: 'Game Length', value: '4 quarters × 12 minutes = 48 minutes' },
            { label: 'Shot Clock', value: '24 seconds (reset to 14 after offensive rebound)' },
            { label: 'Three-Point Line', value: '7.24 meters (23.75 feet), 6.7m at corners' },
            { label: 'Team Fouls', value: '5 fouls per quarter triggers bonus' },
            { label: 'Personal Fouls', value: '6 fouls = disqualification' },
            { label: 'Timeouts', value: '7 timeouts per game (4 in 4th quarter max)' },
            { label: 'Overtime', value: '5 minutes, 2 timeouts per team' },
          ],
        },
        {
          id: 'ncaa',
          title: 'NCAA Rules (College Basketball)',
          description: 'American college basketball rules',
          rules: [
            { label: 'Game Length', value: '2 halves × 20 minutes = 40 minutes' },
            { label: 'Shot Clock', value: '30 seconds (men), 30 seconds (women)' },
            { label: 'Three-Point Line', value: '6.75 meters (22.15 feet)' },
            { label: 'Team Fouls', value: '7 fouls = one-and-one, 10 fouls = double bonus' },
            { label: 'Personal Fouls', value: '5 fouls = disqualification' },
            { label: 'Timeouts', value: '4 timeouts (3 30-second, 1 60-second)' },
            { label: 'Overtime', value: '5 minutes per overtime period' },
          ],
        },
        {
          id: '3x3',
          title: '3x3 Basketball Rules',
          description: 'Fast-paced half-court game, Olympic sport since 2020',
          rules: [
            { label: 'Game Length', value: '10 minutes or first to 21 points' },
            { label: 'Shot Clock', value: '12 seconds' },
            { label: 'Scoring', value: '1 point inside arc, 2 points outside arc' },
            { label: 'Team Fouls', value: '7 fouls = 2 free throws, 10+ = 2 FT + possession' },
            { label: 'Personal Fouls', value: '4 fouls = disqualification' },
            { label: 'Timeouts', value: '1 timeout per team' },
            { label: 'Overtime', value: 'First team to score 2 points wins' },
          ],
        },
      ],

      comparison: {
        title: 'Quick Comparison Table',
        headers: ['Rule', 'FIBA', 'NBA', 'NCAA', '3x3'],
        rows: [
          ['Quarter/Half Length', '10 min', '12 min', '20 min (half)', '10 min total'],
          ['Shot Clock', '24 sec', '24 sec', '30 sec', '12 sec'],
          ['Fouls to Foul Out', '5', '6', '5', '4'],
          ['3-Point Distance', '6.75m', '7.24m', '6.75m', '6.75m'],
          ['Bonus Free Throws', '5th foul', '5th foul', '7th foul', '7th foul'],
        ],
      },

      tips: {
        title: 'Scorekeeper Tips',
        items: [
          'Always confirm the rule set before the game starts',
          'Track team fouls separately for each quarter/half',
          'Reset team fouls at the start of each period (except NCAA halves)',
          'Announce bonus status clearly to both teams',
          'Keep a running timeline of all scoring plays for disputes',
        ],
      },
    },

    zh: {
      title: '篮球规则指南',
      subtitle: 'FIBA、NBA、NCAA 和 3x3 篮球规则完整指南',
      intro: '了解不同篮球规则体系之间的差异对球员、教练和记分员至关重要。本指南涵盖了您需要了解的主要规则差异。',

      sections: [
        {
          id: 'fiba',
          title: 'FIBA规则（国际篮联）',
          description: '用于奥运会、世界杯和大多数国际比赛',
          rules: [
            { label: '比赛时长', value: '4节 × 10分钟 = 40分钟' },
            { label: '进攻时间', value: '24秒（进攻篮板后重置为14秒）' },
            { label: '三分线距离', value: '6.75米' },
            { label: '全队犯规', value: '每节第5次犯规后进入罚球状态' },
            { label: '个人犯规', value: '5次犯规 = 罚下' },
            { label: '暂停', value: '上半场2次，下半场3次，加时赛1次' },
            { label: '加时赛', value: '每个加时赛5分钟' },
          ],
        },
        {
          id: 'nba',
          title: 'NBA规则',
          description: '北美职业篮球联赛',
          rules: [
            { label: '比赛时长', value: '4节 × 12分钟 = 48分钟' },
            { label: '进攻时间', value: '24秒（进攻篮板后重置为14秒）' },
            { label: '三分线距离', value: '7.24米（底角6.7米）' },
            { label: '全队犯规', value: '每节第5次犯规后进入罚球状态' },
            { label: '个人犯规', value: '6次犯规 = 罚下' },
            { label: '暂停', value: '每场7次（第四节最多用4次）' },
            { label: '加时赛', value: '5分钟，每队2次暂停' },
          ],
        },
        {
          id: 'ncaa',
          title: 'NCAA规则（美国大学篮球）',
          description: '美国大学篮球比赛规则',
          rules: [
            { label: '比赛时长', value: '2个半场 × 20分钟 = 40分钟' },
            { label: '进攻时间', value: '30秒' },
            { label: '三分线距离', value: '6.75米' },
            { label: '全队犯规', value: '第7次犯规进入1+1罚球，第10次进入双罚' },
            { label: '个人犯规', value: '5次犯规 = 罚下' },
            { label: '暂停', value: '4次（3次30秒，1次60秒）' },
            { label: '加时赛', value: '每个加时赛5分钟' },
          ],
        },
        {
          id: '3x3',
          title: '三人篮球规则',
          description: '快节奏半场比赛，2020年起成为奥运项目',
          rules: [
            { label: '比赛时长', value: '10分钟或先得21分' },
            { label: '进攻时间', value: '12秒' },
            { label: '得分规则', value: '弧内1分，弧外2分' },
            { label: '全队犯规', value: '第7次犯规罚2球，第10次及以后罚2球+球权' },
            { label: '个人犯规', value: '4次犯规 = 罚下' },
            { label: '暂停', value: '每队1次' },
            { label: '加时赛', value: '先得2分的队伍获胜' },
          ],
        },
      ],

      comparison: {
        title: '规则快速对比表',
        headers: ['规则', 'FIBA', 'NBA', 'NCAA', '3x3'],
        rows: [
          ['每节/半场时长', '10分钟', '12分钟', '20分钟(半场)', '共10分钟'],
          ['进攻时间', '24秒', '24秒', '30秒', '12秒'],
          ['犯满离场', '5次', '6次', '5次', '4次'],
          ['三分线距离', '6.75米', '7.24米', '6.75米', '6.75米'],
          ['罚球状态', '第5次犯规', '第5次犯规', '第7次犯规', '第7次犯规'],
        ],
      },

      tips: {
        title: '记分员提示',
        items: [
          '比赛开始前务必确认使用的规则体系',
          '每节/半场单独记录全队犯规',
          '每节开始时重置全队犯规（NCAA按半场重置）',
          '清楚地向双方宣布罚球状态',
          '记录所有得分事件的时间线，以便争议时核查',
        ],
      },
    },
  };

  const c = content[language];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Helmet>
        <title>{seoContent[language].title}</title>
        <meta name="title" content={seoContent[language].title} />
        <meta name="description" content={seoContent[language].description} />
        <link rel="canonical" href="https://www.basketballscoreboardonline.com/rules" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.basketballscoreboardonline.com/rules" />
        <meta property="og:title" content={seoContent[language].title} />
        <meta property="og:description" content={seoContent[language].description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.basketballscoreboardonline.com/rules" />
        <meta name="twitter:title" content={seoContent[language].title} />
        <meta name="twitter:description" content={seoContent[language].description} />
      </Helmet>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {c.title}
          </h1>
          <p className="text-xl text-[var(--color-accent)]">
            {c.subtitle}
          </p>
          <p className="mt-4 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {c.intro}
          </p>
        </div>

        {/* Rule sections */}
        {c.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-12">
            <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {section.title}
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                {section.description}
              </p>

              <div className="grid gap-3">
                {section.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-[var(--color-bg-primary)] last:border-0"
                  >
                    <span className="text-[var(--color-text-secondary)]">
                      {rule.label}
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {rule.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            {c.comparison.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-accent)]">
                  {c.comparison.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-white font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.comparison.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-[var(--color-bg-primary)] last:border-0"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 ${
                          cellIndex === 0
                            ? 'text-[var(--color-text-secondary)]'
                            : 'text-[var(--color-text-primary)] font-medium'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            {c.tips.title}
          </h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6">
            <ul className="space-y-3">
              {c.tips.items.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[var(--color-accent)]">✓</span>
                  <span className="text-[var(--color-text-primary)]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-[var(--color-bg-secondary)] rounded-xl p-8">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            {language === 'en' ? 'Ready to keep score?' : '准备好记分了吗？'}
          </h3>
          <a
            href="/app"
            className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            {language === 'en' ? 'Open Scoreboard' : '打开计分板'}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-bg-secondary)] mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-[var(--color-text-secondary)]">
          <p>© 2024 Basketball Scoreboard Online. {language === 'en' ? 'Free & Open Source.' : '免费开源。'}</p>
        </div>
      </footer>
    </div>
  );
}
