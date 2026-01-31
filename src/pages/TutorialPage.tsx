import { useGameStore } from '../stores/gameStore';
import { Header } from '../components/Header';

export function TutorialPage() {
  const { language } = useGameStore();

  const content = {
    en: {
      title: 'How to Use Basketball Scoreboard',
      subtitle: 'Complete guide to mastering the scoreboard in minutes',

      sections: [
        {
          title: 'Getting Started',
          icon: '🚀',
          steps: [
            {
              title: 'Open the Scoreboard',
              description: 'Navigate to the main page. The scoreboard is ready to use immediately - no account required.',
            },
            {
              title: 'Set Your Teams',
              description: 'Click the Settings (⚙️) button to customize team names and colors. The default is HOME vs AWAY.',
            },
            {
              title: 'Choose Your Rules',
              description: 'Select FIBA, NBA, NCAA, or 3x3 rules. This automatically sets quarter length, shot clock, and foul limits.',
            },
          ],
        },
        {
          title: 'Scoring Points',
          icon: '🏀',
          steps: [
            {
              title: 'Using Buttons',
              description: 'Click +1, +2, or +3 buttons under each team to add points. Use -1 to correct mistakes.',
            },
            {
              title: 'Using Keyboard (Faster!)',
              description: 'Press 1, 2, 3 for home team points. Press 7, 8, 9 for away team points. Hold Shift + number to subtract.',
            },
          ],
        },
        {
          title: 'Managing the Timer',
          icon: '⏱️',
          steps: [
            {
              title: 'Start/Stop',
              description: 'Click the green Start button or press Spacebar to toggle the game timer.',
            },
            {
              title: 'Shot Clock',
              description: 'Click 24 to reset shot clock fully, or 14 for offensive rebound reset. Keyboard: R (24s) or Shift+R (14s).',
            },
            {
              title: 'Period Changes',
              description: 'When time expires, click "Period →" to advance to the next quarter. Fouls reset automatically.',
            },
          ],
        },
        {
          title: 'Tracking Fouls',
          icon: '🟡',
          steps: [
            {
              title: 'Add Team Fouls',
              description: 'Click "Foul" under the team, or press F (home) / Shift+F (away) on keyboard.',
            },
            {
              title: 'Bonus Indicators',
              description: 'The foul dots fill up. Yellow "BONUS" appears when the team is in penalty. Watch for this to award free throws!',
            },
            {
              title: 'Player Fouls',
              description: 'Click "Player Stats" to track individual player fouls. Players with 5+ fouls are highlighted red.',
            },
          ],
        },
        {
          title: 'Timeouts & Possession',
          icon: '⏸️',
          steps: [
            {
              title: 'Call Timeout',
              description: 'Click "Timeout" button or press T (home) / Shift+T (away). Timer automatically pauses.',
            },
            {
              title: 'Track Possession',
              description: 'Click ◄► under a team to show possession arrow, or press Q (home) / W (away) / P (toggle).',
            },
          ],
        },
        {
          title: 'Advanced Features',
          icon: '⚡',
          steps: [
            {
              title: 'Fullscreen Mode',
              description: 'Press Escape or click the fullscreen button. Perfect for projecting on a big screen.',
            },
            {
              title: 'Player Statistics',
              description: 'Click "Player Stats" to track points, assists, rebounds, steals, blocks, and turnovers per player.',
            },
            {
              title: 'OBS Streaming',
              description: 'Copy the OBS link to add a transparent scoreboard overlay to your live stream.',
            },
            {
              title: 'Offline Mode',
              description: 'The app works without internet! Install it as a PWA for the best experience.',
            },
          ],
        },
      ],

      keyboard: {
        title: 'Keyboard Shortcuts Reference',
        groups: [
          {
            name: 'Scoring',
            shortcuts: [
              { key: '1 / 2 / 3', action: 'Home team +1/+2/+3' },
              { key: '7 / 8 / 9', action: 'Away team +1/+2/+3' },
              { key: 'Shift + 1 or 7', action: 'Subtract 1 point' },
            ],
          },
          {
            name: 'Timer',
            shortcuts: [
              { key: 'Space', action: 'Start/Pause timer' },
              { key: 'R', action: 'Reset shot clock (24s)' },
              { key: 'Shift + R', action: 'Reset shot clock (14s)' },
              { key: 'N', action: 'Next period' },
            ],
          },
          {
            name: 'Game Control',
            shortcuts: [
              { key: 'F / Shift+F', action: 'Foul (home/away)' },
              { key: 'T / Shift+T', action: 'Timeout (home/away)' },
              { key: 'Q / W / P', action: 'Possession (home/away/toggle)' },
              { key: 'Ctrl + Z', action: 'Undo' },
              { key: 'Escape', action: 'Toggle fullscreen' },
            ],
          },
        ],
      },

      tips: {
        title: 'Pro Tips',
        items: [
          'Practice keyboard shortcuts before the game - they\'re much faster than clicking',
          'Use fullscreen mode to eliminate distractions',
          'Set up team names and colors before the game starts',
          'The shot clock automatically pauses when game time hits zero',
          'Install as PWA for faster loading and offline reliability',
        ],
      },
    },

    zh: {
      title: '篮球计分板使用教程',
      subtitle: '几分钟内掌握计分板的完整指南',

      sections: [
        {
          title: '快速开始',
          icon: '🚀',
          steps: [
            {
              title: '打开计分板',
              description: '进入主页面，计分板立即可用，无需注册账号。',
            },
            {
              title: '设置队伍',
              description: '点击设置按钮(⚙️)自定义队伍名称和颜色。默认为"主队"和"客队"。',
            },
            {
              title: '选择规则',
              description: '选择FIBA、NBA、NCAA或3x3规则，系统会自动设置节长、进攻时间和犯规限制。',
            },
          ],
        },
        {
          title: '记录得分',
          icon: '🏀',
          steps: [
            {
              title: '使用按钮',
              description: '点击每队下方的+1、+2、+3按钮添加分数，使用-1纠正错误。',
            },
            {
              title: '使用键盘（更快！）',
              description: '按1、2、3给主队加分，按7、8、9给客队加分。按住Shift+数字可减分。',
            },
          ],
        },
        {
          title: '管理计时器',
          icon: '⏱️',
          steps: [
            {
              title: '开始/暂停',
              description: '点击绿色开始按钮或按空格键切换比赛计时器。',
            },
            {
              title: '进攻时间',
              description: '点击24完全重置进攻时间，点击14用于进攻篮板重置。键盘：R(24秒)或Shift+R(14秒)。',
            },
            {
              title: '节间切换',
              description: '时间到时，点击"节→"进入下一节。犯规数会自动重置。',
            },
          ],
        },
        {
          title: '记录犯规',
          icon: '🟡',
          steps: [
            {
              title: '添加全队犯规',
              description: '点击队伍下方的"犯规"按钮，或按F(主队)/Shift+F(客队)。',
            },
            {
              title: '罚球状态指示',
              description: '犯规圆点会逐个填满。当队伍进入罚球状态时会显示黄色"罚球"提示，注意此时要判罚球！',
            },
            {
              title: '球员犯规',
              description: '点击"球员统计"追踪个人犯规。犯规5次及以上的球员会以红色高亮显示。',
            },
          ],
        },
        {
          title: '暂停与球权',
          icon: '⏸️',
          steps: [
            {
              title: '叫暂停',
              description: '点击"暂停"按钮或按T(主队)/Shift+T(客队)。计时器会自动暂停。',
            },
            {
              title: '记录球权',
              description: '点击队伍下方的◄►显示球权箭头，或按Q(主队)/W(客队)/P(切换)。',
            },
          ],
        },
        {
          title: '高级功能',
          icon: '⚡',
          steps: [
            {
              title: '全屏模式',
              description: '按Escape键或点击全屏按钮。非常适合投影到大屏幕上使用。',
            },
            {
              title: '球员统计',
              description: '点击"球员统计"可追踪每位球员的得分、助攻、篮板、抢断、盖帽和失误。',
            },
            {
              title: 'OBS直播',
              description: '复制OBS链接，可在直播中添加透明计分板叠加层。',
            },
            {
              title: '离线模式',
              description: '无需网络即可使用！安装为PWA应用获得最佳体验。',
            },
          ],
        },
      ],

      keyboard: {
        title: '键盘快捷键参考',
        groups: [
          {
            name: '得分',
            shortcuts: [
              { key: '1 / 2 / 3', action: '主队 +1/+2/+3' },
              { key: '7 / 8 / 9', action: '客队 +1/+2/+3' },
              { key: 'Shift + 1 或 7', action: '减1分' },
            ],
          },
          {
            name: '计时器',
            shortcuts: [
              { key: '空格', action: '开始/暂停计时器' },
              { key: 'R', action: '重置进攻时间(24秒)' },
              { key: 'Shift + R', action: '重置进攻时间(14秒)' },
              { key: 'N', action: '下一节' },
            ],
          },
          {
            name: '比赛控制',
            shortcuts: [
              { key: 'F / Shift+F', action: '犯规（主队/客队）' },
              { key: 'T / Shift+T', action: '暂停（主队/客队）' },
              { key: 'Q / W / P', action: '球权（主队/客队/切换）' },
              { key: 'Ctrl + Z', action: '撤销' },
              { key: 'Escape', action: '切换全屏' },
            ],
          },
        ],
      },

      tips: {
        title: '专业技巧',
        items: [
          '比赛前练习键盘快捷键——比点击快得多',
          '使用全屏模式消除干扰',
          '比赛开始前设置好队伍名称和颜色',
          '当比赛时间归零时，进攻时间会自动暂停',
          '安装为PWA应用可实现更快加载和离线可靠性',
        ],
      },
    },
  };

  const c = content[language];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
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

        {/* Tutorial sections */}
        {c.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-10">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
              <span className="text-3xl">{section.icon}</span>
              {section.title}
            </h2>

            <div className="space-y-4">
              {section.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className="bg-[var(--color-bg-secondary)] rounded-xl p-5 flex gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold">
                    {stepIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Keyboard shortcuts */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            ⌨️ {c.keyboard.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {c.keyboard.groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="bg-[var(--color-bg-secondary)] rounded-xl p-4"
              >
                <h3 className="font-semibold text-[var(--color-accent)] mb-3">
                  {group.name}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, shortcutIndex) => (
                    <div key={shortcutIndex} className="flex justify-between gap-2">
                      <kbd className="px-2 py-1 bg-[var(--color-bg-primary)] rounded text-xs font-mono text-[var(--color-accent)]">
                        {shortcut.key}
                      </kbd>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {shortcut.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pro tips */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            💡 {c.tips.title}
          </h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6">
            <ul className="space-y-3">
              {c.tips.items.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[var(--color-success)]">✓</span>
                  <span className="text-[var(--color-text-primary)]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-[var(--color-bg-secondary)] rounded-xl p-8">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            {language === 'en' ? 'Ready to start?' : '准备好开始了吗？'}
          </h3>
          <a
            href="/app"
            className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            {language === 'en' ? 'Open Scoreboard' : '打开计分板'}
          </a>
        </div>
      </main>

      <footer className="bg-[var(--color-bg-secondary)] mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-[var(--color-text-secondary)]">
          <p>© 2024 Basketball Scoreboard. {language === 'en' ? 'Free & Open Source.' : '免费开源。'}</p>
        </div>
      </footer>
    </div>
  );
}
