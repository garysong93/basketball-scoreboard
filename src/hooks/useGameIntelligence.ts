import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export type AlertType = 'warning' | 'info' | 'danger' | 'success';
export type AlertCategory = 'foul' | 'timeout' | 'score' | 'time' | 'period' | 'general';

export interface GameAlert {
  id: string;
  type: AlertType;
  category: AlertCategory;
  message: string;
  messageZh: string;
  timestamp: number;
  dismissed: boolean;
  priority: number; // 1-5, higher = more important
}

interface UseGameIntelligenceReturn {
  alerts: GameAlert[];
  activeAlerts: GameAlert[];
  dismissAlert: (id: string) => void;
  dismissAllAlerts: () => void;
  clearOldAlerts: () => void;
}

export function useGameIntelligence(): UseGameIntelligenceReturn {
  const {
    home,
    away,
    gameTime,
    period,
    possession,
    isRunning,
    rules,
    events,
  } = useGameStore();

  const [alerts, setAlerts] = useState<GameAlert[]>([]);
  const lastCheckRef = useRef({
    homeFouls: 0,
    awayFouls: 0,
    homeScore: 0,
    awayScore: 0,
    period: 1,
    gameTime: rules.periodLength,
    homeTimeouts: rules.maxTimeoutsPerHalf,
    awayTimeouts: rules.maxTimeoutsPerHalf,
  });

  // Track seen event IDs to avoid duplicate alerts
  const seenEventIdsRef = useRef<Set<string>>(new Set());

  // Generate unique alert ID
  const generateAlertId = () => `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new alert
  const addAlert = useCallback((
    type: AlertType,
    category: AlertCategory,
    message: string,
    messageZh: string,
    priority: number = 3
  ) => {
    const newAlert: GameAlert = {
      id: generateAlertId(),
      type,
      category,
      message,
      messageZh,
      timestamp: Date.now(),
      dismissed: false,
      priority,
    };

    setAlerts(prev => {
      // Avoid duplicate alerts within 5 seconds
      const isDuplicate = prev.some(
        a => a.message === message &&
             Date.now() - a.timestamp < 5000 &&
             !a.dismissed
      );
      if (isDuplicate) return prev;

      return [newAlert, ...prev].slice(0, 50); // Keep last 50 alerts
    });
  }, []);

  // Dismiss a single alert
  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, dismissed: true } : a
    ));
  }, []);

  // Dismiss all alerts
  const dismissAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
  }, []);

  // Clear old dismissed alerts
  const clearOldAlerts = useCallback(() => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    setAlerts(prev => prev.filter(a =>
      !a.dismissed || a.timestamp > fiveMinutesAgo
    ));
  }, []);

  // Check foul situations
  useEffect(() => {
    const last = lastCheckRef.current;
    const bonusFouls = rules.bonusFouls || 5;

    // Home team fouls
    if (home.fouls !== last.homeFouls) {
      if (home.fouls === bonusFouls - 1) {
        addAlert(
          'warning',
          'foul',
          `${home.name} has ${home.fouls} fouls - one more enters bonus!`,
          `${home.name}已有 ${home.fouls} 次犯规 - 再犯一次进入罚球！`,
          4
        );
      } else if (home.fouls === bonusFouls) {
        addAlert(
          'danger',
          'foul',
          `${home.name} in BONUS - all fouls result in free throws`,
          `${home.name}进入罚球状态 - 所有犯规将罚球`,
          5
        );
      } else if (home.fouls === bonusFouls + 2) {
        addAlert(
          'danger',
          'foul',
          `${home.name} in DOUBLE BONUS`,
          `${home.name}进入双倍罚球状态`,
          5
        );
      }
      last.homeFouls = home.fouls;
    }

    // Away team fouls
    if (away.fouls !== last.awayFouls) {
      if (away.fouls === bonusFouls - 1) {
        addAlert(
          'warning',
          'foul',
          `${away.name} has ${away.fouls} fouls - one more enters bonus!`,
          `${away.name}已有 ${away.fouls} 次犯规 - 再犯一次进入罚球！`,
          4
        );
      } else if (away.fouls === bonusFouls) {
        addAlert(
          'danger',
          'foul',
          `${away.name} in BONUS - all fouls result in free throws`,
          `${away.name}进入罚球状态 - 所有犯规将罚球`,
          5
        );
      } else if (away.fouls === bonusFouls + 2) {
        addAlert(
          'danger',
          'foul',
          `${away.name} in DOUBLE BONUS`,
          `${away.name}进入双倍罚球状态`,
          5
        );
      }
      last.awayFouls = away.fouls;
    }
  }, [home.fouls, away.fouls, home.name, away.name, rules.bonusFouls, addAlert]);

  // Check timeout situations
  // Note: timeouts tracks "used" timeouts (starts at 0, increments when called)
  // So "remaining" = maxTimeoutsPerHalf - timeouts
  useEffect(() => {
    const last = lastCheckRef.current;
    const maxTimeouts = rules.maxTimeoutsPerHalf;

    // Home timeouts
    if (home.timeouts !== last.homeTimeouts) {
      const homeRemaining = maxTimeouts - home.timeouts;
      if (homeRemaining === 1) {
        addAlert(
          'warning',
          'timeout',
          `${home.name} has only 1 timeout remaining`,
          `${home.name}仅剩 1 次暂停`,
          3
        );
      } else if (homeRemaining === 0) {
        addAlert(
          'danger',
          'timeout',
          `${home.name} has NO timeouts remaining`,
          `${home.name}已无暂停机会`,
          4
        );
      }
      last.homeTimeouts = home.timeouts;
    }

    // Away timeouts
    if (away.timeouts !== last.awayTimeouts) {
      const awayRemaining = maxTimeouts - away.timeouts;
      if (awayRemaining === 1) {
        addAlert(
          'warning',
          'timeout',
          `${away.name} has only 1 timeout remaining`,
          `${away.name}仅剩 1 次暂停`,
          3
        );
      } else if (awayRemaining === 0) {
        addAlert(
          'danger',
          'timeout',
          `${away.name} has NO timeouts remaining`,
          `${away.name}已无暂停机会`,
          4
        );
      }
      last.awayTimeouts = away.timeouts;
    }
  }, [home.timeouts, away.timeouts, home.name, away.name, rules.maxTimeoutsPerHalf, addAlert]);

  // Check score situations
  useEffect(() => {
    const last = lastCheckRef.current;
    const scoreDiff = Math.abs(home.score - away.score);
    const leader = home.score > away.score ? home.name : away.name;
    const leaderZh = home.score > away.score ? home.name : away.name;

    // Score changes
    if (home.score !== last.homeScore || away.score !== last.awayScore) {
      const prevLeader = last.homeScore > last.awayScore ? 'home' :
                         last.homeScore < last.awayScore ? 'away' : 'tie';
      const currentLeader = home.score > away.score ? 'home' :
                            home.score < away.score ? 'away' : 'tie';

      // Regular scoring notification
      const homeScoreDiff = home.score - last.homeScore;
      const awayScoreDiff = away.score - last.awayScore;

      if (homeScoreDiff > 0) {
        addAlert(
          'success',
          'score',
          `${home.name} +${homeScoreDiff}! (${home.score}-${away.score})`,
          `${home.name} +${homeScoreDiff}！(${home.score}-${away.score})`,
          2
        );
      }

      if (awayScoreDiff > 0) {
        addAlert(
          'success',
          'score',
          `${away.name} +${awayScoreDiff}! (${home.score}-${away.score})`,
          `${away.name} +${awayScoreDiff}！(${home.score}-${away.score})`,
          2
        );
      }

      // Lead change (higher priority)
      if (prevLeader !== 'tie' && currentLeader !== 'tie' && prevLeader !== currentLeader) {
        addAlert(
          'success',
          'score',
          `LEAD CHANGE! ${leader} now leads ${Math.max(home.score, away.score)}-${Math.min(home.score, away.score)}`,
          `领先易主！${leaderZh}现在以 ${Math.max(home.score, away.score)}-${Math.min(home.score, away.score)} 领先`,
          4
        );
      }

      // Tie game
      if (home.score === away.score && home.score > 0 && prevLeader !== 'tie') {
        addAlert(
          'info',
          'score',
          `GAME TIED at ${home.score}!`,
          `比分打平！${home.score}-${away.score}`,
          4
        );
      }

      // Big lead alerts
      if (scoreDiff >= 20 && Math.abs(last.homeScore - last.awayScore) < 20) {
        addAlert(
          'info',
          'score',
          `${leader} leads by 20+ points`,
          `${leaderZh}领先超过20分`,
          3
        );
      }

      // Comeback alert
      if (scoreDiff <= 5 && Math.abs(last.homeScore - last.awayScore) > 10) {
        addAlert(
          'success',
          'score',
          `Close game! Only ${scoreDiff} point difference`,
          `比赛胶着！仅差 ${scoreDiff} 分`,
          4
        );
      }

      last.homeScore = home.score;
      last.awayScore = away.score;
    }
  }, [home.score, away.score, home.name, away.name, addAlert]);

  // Check time situations
  useEffect(() => {
    const last = lastCheckRef.current;

    if (isRunning && gameTime !== last.gameTime) {
      // Last 2 minutes warning
      if (gameTime === 120 && last.gameTime > 120) {
        const scoreDiff = Math.abs(home.score - away.score);
        if (scoreDiff <= 10) {
          addAlert(
            'warning',
            'time',
            `CRITICAL: 2 minutes remaining in close game!`,
            `关键时刻：比赛还剩2分钟，比分接近！`,
            5
          );
        } else {
          addAlert(
            'info',
            'time',
            `2 minutes remaining in period ${period}`,
            `第${period}节还剩2分钟`,
            3
          );
        }
      }

      // Last minute warning
      if (gameTime === 60 && last.gameTime > 60) {
        addAlert(
          'warning',
          'time',
          `FINAL MINUTE of period ${period}!`,
          `第${period}节最后一分钟！`,
          4
        );
      }

      // Last 30 seconds
      if (gameTime === 30 && last.gameTime > 30) {
        addAlert(
          'danger',
          'time',
          `30 SECONDS remaining!`,
          `还剩30秒！`,
          5
        );
      }

      // Last 10 seconds
      if (gameTime === 10 && last.gameTime > 10) {
        addAlert(
          'danger',
          'time',
          `FINAL 10 SECONDS!`,
          `最后10秒！`,
          5
        );
      }

      last.gameTime = gameTime;
    }
  }, [gameTime, isRunning, period, home.score, away.score, addAlert]);

  // Check period changes
  useEffect(() => {
    const last = lastCheckRef.current;

    if (period !== last.period) {
      if (period > last.period) {
        // Period started
        addAlert(
          'info',
          'period',
          `Period ${period} has started`,
          `第${period}节开始`,
          3
        );

        // Final period alert
        if (period === rules.periodCount) {
          const scoreDiff = Math.abs(home.score - away.score);
          if (scoreDiff <= 10) {
            addAlert(
              'warning',
              'period',
              `FINAL PERIOD with close score!`,
              `决胜节！比分接近！`,
              5
            );
          }
        }

        // Overtime
        if (period > rules.periodCount) {
          addAlert(
            'danger',
            'period',
            `OVERTIME ${period - rules.periodCount}!`,
            `加时赛第${period - rules.periodCount}节！`,
            5
          );
        }
      }

      // Reset fouls for new period (FIBA rules)
      if (rules.name.includes('FIBA') || rules.name.includes('3x3')) {
        addAlert(
          'info',
          'foul',
          `Team fouls reset for new period`,
          `球队犯规已重置`,
          2
        );
      }

      last.period = period;
    }
  }, [period, rules.periodCount, rules.name, home.score, away.score, addAlert]);

  // Possession reminder
  useEffect(() => {
    if (possession === null && isRunning) {
      // Only remind occasionally, not constantly
      const shouldRemind = Math.random() < 0.1; // 10% chance
      if (shouldRemind) {
        addAlert(
          'info',
          'general',
          `Don't forget to set ball possession`,
          `请记得设置控球权`,
          1
        );
      }
    }
  }, [possession, isRunning, addAlert]);

  // Monitor events array for fouls, timeouts, and player stats
  useEffect(() => {
    const eventTypes = ['foul', 'timeout', 'assist', 'rebound', 'steal', 'block', 'turnover'] as const;

    events.forEach((event) => {
      if (eventTypes.includes(event.type as typeof eventTypes[number]) && !seenEventIdsRef.current.has(event.id)) {
        seenEventIdsRef.current.add(event.id);

        // Generate alert based on event type
        const alertConfig: Record<string, { category: AlertCategory; type: AlertType; priority: number }> = {
          foul: { category: 'foul', type: 'warning', priority: 2 },
          timeout: { category: 'timeout', type: 'info', priority: 2 },
          assist: { category: 'score', type: 'success', priority: 2 },
          rebound: { category: 'score', type: 'info', priority: 1 },
          steal: { category: 'score', type: 'success', priority: 2 },
          block: { category: 'score', type: 'success', priority: 2 },
          turnover: { category: 'score', type: 'warning', priority: 2 },
        };

        const config = alertConfig[event.type];
        if (config) {
          addAlert(
            config.type,
            config.category,
            event.description,
            event.description, // Use same description for both languages
            config.priority
          );
        }
      }
    });
  }, [events, addAlert]);

  // Get active (non-dismissed) alerts sorted by priority
  const activeAlerts = alerts
    .filter(a => !a.dismissed)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5); // Show max 5 active alerts

  return {
    alerts,
    activeAlerts,
    dismissAlert,
    dismissAllAlerts,
    clearOldAlerts,
  };
}
