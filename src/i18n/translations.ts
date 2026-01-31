export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // App
    appName: 'Basketball Scoreboard Online',

    // Teams
    home: 'HOME',
    away: 'AWAY',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',

    // Score
    score: 'Score',
    points: 'pts',

    // Timer
    gameTime: 'Game Time',
    shotClock: 'Shot Clock',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',

    // Period
    period: 'Period',
    quarter: 'Q',
    half: 'H',
    overtime: 'OT',

    // Fouls
    fouls: 'Fouls',
    teamFouls: 'Team Fouls',
    bonus: 'BONUS',
    doubleBonus: 'DOUBLE BONUS',

    // Timeouts
    timeouts: 'Timeouts',
    timeout: 'Timeout',

    // Possession
    possession: 'Possession',

    // Controls
    addPoints: 'Add Points',
    subtractPoints: 'Subtract Points',
    addFoul: 'Add Foul',
    callTimeout: 'Call Timeout',

    // Players
    players: 'Players',
    playerName: 'Name',
    playerNumber: 'Number',
    playerStats: 'Player Stats',
    assists: 'AST',
    rebounds: 'REB',
    steals: 'STL',
    blocks: 'BLK',
    turnovers: 'TO',
    minutes: 'MIN',

    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    rules: 'Rules',
    fiba: 'FIBA',
    nba: 'NBA',
    ncaa: 'NCAA',
    threeOnThree: '3x3',
    custom: 'Custom',
    periodLength: 'Period Length (min)',
    shotClockLength: 'Shot Clock (sec)',
    maxFouls: 'Max Fouls per Period',
    maxTimeouts: 'Timeouts per Half',

    // Actions
    newGame: 'New Game',
    endGame: 'End Game',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    undo: 'Undo',
    redo: 'Redo',

    // Keyboard
    keyboard: 'Keyboard Shortcuts',
    keyboardShortcuts: 'Keyboard Shortcuts',
    pressKey: 'Press key',

    // OBS
    obsMode: 'OBS Mode',
    copyObsLink: 'Copy OBS Link',
    linkCopied: 'Link copied!',

    // Alerts
    bonusAlert: 'Team is in bonus!',
    foulLimitAlert: 'Player has fouled out!',
    gameOver: 'Game Over',
    confirmNewGame: 'Start a new game? Current game will be lost.',
    confirmEndGame: 'End this game?',

    // Status
    offline: 'Offline',
    online: 'Online',
    syncing: 'Syncing...',
    saved: 'Saved',
  },

  zh: {
    // App
    appName: 'Basketball Scoreboard Online',

    // Teams
    home: '主队',
    away: '客队',
    homeTeam: '主队',
    awayTeam: '客队',

    // Score
    score: '得分',
    points: '分',

    // Timer
    gameTime: '比赛时间',
    shotClock: '进攻时间',
    start: '开始',
    pause: '暂停',
    reset: '重置',

    // Period
    period: '节',
    quarter: '第',
    half: '半场',
    overtime: '加时',

    // Fouls
    fouls: '犯规',
    teamFouls: '全队犯规',
    bonus: '罚球',
    doubleBonus: '双罚',

    // Timeouts
    timeouts: '暂停',
    timeout: '暂停',

    // Possession
    possession: '球权',

    // Controls
    addPoints: '加分',
    subtractPoints: '减分',
    addFoul: '犯规',
    callTimeout: '暂停',

    // Players
    players: '球员',
    playerName: '姓名',
    playerNumber: '号码',
    playerStats: '球员统计',
    assists: '助攻',
    rebounds: '篮板',
    steals: '抢断',
    blocks: '盖帽',
    turnovers: '失误',
    minutes: '时间',

    // Settings
    settings: '设置',
    language: '语言',
    theme: '主题',
    dark: '深色',
    light: '浅色',
    rules: '规则',
    fiba: 'FIBA',
    nba: 'NBA',
    ncaa: 'NCAA',
    threeOnThree: '三人篮球',
    custom: '自定义',
    periodLength: '每节时长（分钟）',
    shotClockLength: '进攻时间（秒）',
    maxFouls: '每节犯规上限',
    maxTimeouts: '每半场暂停次数',

    // Actions
    newGame: '新比赛',
    endGame: '结束比赛',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    undo: '撤销',
    redo: '重做',

    // Keyboard
    keyboard: '快捷键',
    keyboardShortcuts: '键盘快捷键',
    pressKey: '按键',

    // OBS
    obsMode: 'OBS模式',
    copyObsLink: '复制OBS链接',
    linkCopied: '链接已复制！',

    // Alerts
    bonusAlert: '进入罚球状态！',
    foulLimitAlert: '球员犯满离场！',
    gameOver: '比赛结束',
    confirmNewGame: '开始新比赛？当前比赛数据将丢失。',
    confirmEndGame: '结束这场比赛？',

    // Status
    offline: '离线',
    online: '在线',
    syncing: '同步中...',
    saved: '已保存',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
