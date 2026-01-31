export type RefereeRole = 'host' | 'main_referee' | 'assistant_referee' | 'technical' | 'viewer';

export interface RefereePermissions {
  canScore: boolean;
  canFoul: boolean;
  canTimeout: boolean;
  canTimer: boolean;
  canPeriod: boolean;
  canPossession: boolean;
  canEditPlayers: boolean;
  canEditSettings: boolean;
}

export const REFEREE_ROLES: Record<RefereeRole, {
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  icon: string;
  permissions: RefereePermissions;
}> = {
  host: {
    name: { en: 'Host', zh: '主持人' },
    description: {
      en: 'Full control - can modify all game settings and data',
      zh: '完全控制 - 可修改所有比赛设置和数据'
    },
    icon: '👑',
    permissions: {
      canScore: true,
      canFoul: true,
      canTimeout: true,
      canTimer: true,
      canPeriod: true,
      canPossession: true,
      canEditPlayers: true,
      canEditSettings: true,
    },
  },
  main_referee: {
    name: { en: 'Main Referee', zh: '主裁判' },
    description: {
      en: 'Primary control - scoring, fouls, timer, periods',
      zh: '主要控制 - 计分、犯规、计时、节数'
    },
    icon: '🏀',
    permissions: {
      canScore: true,
      canFoul: true,
      canTimeout: true,
      canTimer: true,
      canPeriod: true,
      canPossession: true,
      canEditPlayers: false,
      canEditSettings: false,
    },
  },
  assistant_referee: {
    name: { en: 'Assistant Referee', zh: '副裁判' },
    description: {
      en: 'Support control - fouls, timeouts, possession',
      zh: '辅助控制 - 犯规、暂停、控球权'
    },
    icon: '📋',
    permissions: {
      canScore: false,
      canFoul: true,
      canTimeout: true,
      canTimer: false,
      canPeriod: false,
      canPossession: true,
      canEditPlayers: false,
      canEditSettings: false,
    },
  },
  technical: {
    name: { en: 'Technical Table', zh: '技术台' },
    description: {
      en: 'Timer control - game clock, shot clock, periods',
      zh: '计时控制 - 比赛时钟、进攻时钟、节数'
    },
    icon: '⏱️',
    permissions: {
      canScore: false,
      canFoul: false,
      canTimeout: false,
      canTimer: true,
      canPeriod: true,
      canPossession: false,
      canEditPlayers: false,
      canEditSettings: false,
    },
  },
  viewer: {
    name: { en: 'Viewer', zh: '观众' },
    description: {
      en: 'Watch only - no editing permissions',
      zh: '仅观看 - 无编辑权限'
    },
    icon: '👁️',
    permissions: {
      canScore: false,
      canFoul: false,
      canTimeout: false,
      canTimer: false,
      canPeriod: false,
      canPossession: false,
      canEditPlayers: false,
      canEditSettings: false,
    },
  },
};

export function getPermissions(role: RefereeRole): RefereePermissions {
  return REFEREE_ROLES[role].permissions;
}

export function canPerformAction(role: RefereeRole, action: keyof RefereePermissions): boolean {
  return REFEREE_ROLES[role].permissions[action];
}

export function getRoleInfo(role: RefereeRole, language: 'en' | 'zh') {
  const roleData = REFEREE_ROLES[role];
  return {
    name: roleData.name[language],
    description: roleData.description[language],
    icon: roleData.icon,
    permissions: roleData.permissions,
  };
}
