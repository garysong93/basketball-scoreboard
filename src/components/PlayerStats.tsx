import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { translations } from '../i18n';
import { usePermissions } from '../hooks/usePermissions';
import type { Team, PlayerStats as PlayerStatsType } from '../stores/gameStore';

interface PlayerStatsProps {
  team: Team;
  onClose: () => void;
}

export function PlayerStats({ team: initialTeam, onClose }: PlayerStatsProps) {
  const {
    home,
    away,
    language,
    updatePlayerStats,
    addPlayer,
    removePlayer,
    togglePlayerOnCourt,
    addScore,
    addFoul,
    recordPlayerStat,
  } = useGameStore();

  const permissions = usePermissions();
  const t = translations[language];

  // Allow switching between teams
  const [currentTeam, setCurrentTeam] = useState<Team>(initialTeam);
  const teamState = currentTeam === 'home' ? home : away;
  const otherTeamState = currentTeam === 'home' ? away : home;

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && newPlayerNumber.trim()) {
      addPlayer(currentTeam, newPlayerName.trim(), newPlayerNumber.trim());
      setNewPlayerName('');
      setNewPlayerNumber('');
    }
  };

  const startEditing = (player: { id: string; name: string; number: string }) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
    setEditNumber(player.number);
  };

  const saveEditing = (playerId: string) => {
    if (editName.trim() && editNumber.trim()) {
      updatePlayerStats(currentTeam, playerId, {
        name: editName.trim(),
        number: editNumber.trim(),
      });
    }
    setEditingPlayer(null);
  };

  const cancelEditing = () => {
    setEditingPlayer(null);
    setEditName('');
    setEditNumber('');
  };

  const handleStatChange = (
    playerId: string,
    stat: keyof PlayerStatsType,
    delta: number
  ) => {
    const player = teamState.players.find((p) => p.id === playerId);
    if (!player) return;

    const currentValue = player[stat] as number;
    const newValue = Math.max(0, currentValue + delta);

    // For stats that should be recorded in timeline
    const recordableStats: Record<string, 'assist' | 'rebound' | 'steal' | 'block' | 'turnover'> = {
      assists: 'assist',
      rebounds: 'rebound',
      steals: 'steal',
      blocks: 'block',
      turnovers: 'turnover',
    };

    if (stat === 'points') {
      // Points are handled separately
      updatePlayerStats(currentTeam, playerId, { [stat]: newValue });
      if (delta > 0) {
        addScore(currentTeam, delta, playerId);
      }
    } else if (recordableStats[stat] && delta > 0) {
      // Record to timeline for positive changes
      recordPlayerStat(currentTeam, playerId, recordableStats[stat], delta);
    } else {
      // Just update the stat (for decrements or non-recordable stats)
      updatePlayerStats(currentTeam, playerId, { [stat]: newValue });
    }
  };

  const handleFoulPlayer = (playerId: string) => {
    addFoul(currentTeam, playerId);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] sm:rounded-xl w-full sm:max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header with team switcher */}
        <div
          className="p-3 sm:p-4 flex justify-between items-center"
          style={{ backgroundColor: teamState.color }}
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <h2 className="text-base sm:text-xl font-bold text-white truncate">
              {teamState.name}
            </h2>
            {/* Team switcher */}
            <button
              onClick={() => setCurrentTeam(currentTeam === 'home' ? 'away' : 'home')}
              className="px-2 sm:px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0"
            >
              ↔️ <span className="hidden xs:inline">{otherTeamState.name}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Player list */}
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          {/* Mobile: Card-based layout */}
          <div className="md:hidden space-y-3">
            {teamState.players.map((player) => (
              <div
                key={player.id}
                className={`rounded-lg p-3 ${
                  player.isOnCourt ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-secondary)]/50'
                }`}
              >
                {/* Player header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => togglePlayerOnCourt(currentTeam, player.id)}
                      className={`w-5 h-5 rounded-full flex-shrink-0 ${
                        player.isOnCourt
                          ? 'bg-[var(--color-success)]'
                          : 'bg-[var(--color-bg-primary)]'
                      }`}
                    />
                    {editingPlayer === player.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-10 px-1 py-0.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-accent)] text-center text-sm"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-1 py-0.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-accent)] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing(player.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <button
                          onClick={() => saveEditing(player.id)}
                          className="w-6 h-6 rounded bg-[var(--color-success)] text-white text-xs"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="w-6 h-6 rounded bg-[var(--color-danger)] text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditing(player)}
                        className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-accent)] transition-colors flex-1 min-w-0"
                      >
                        <span className="font-bold text-lg">#{player.number}</span>
                        <span className="truncate">{player.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {permissions.canScore && (
                      <button
                        onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-1"
                      >
                        {expandedPlayer === player.id ? '▲' : '▼'}
                      </button>
                    )}
                    {permissions.canEditPlayers && (
                      <button
                        onClick={() => removePlayer(currentTeam, player.id)}
                        className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 rounded p-1"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick actions row - always visible */}
                <div className="flex items-center justify-between gap-2">
                  {/* Points */}
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold" style={{ color: teamState.color }}>{player.points}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">PTS</span>
                  </div>

                  {/* Score buttons - only show if user has permissions */}
                  <div className="flex items-center gap-1">
                    {permissions.canScore && (
                      <>
                        <button
                          onClick={() => handleStatChange(player.id, 'points', 1)}
                          className="w-9 h-9 rounded-lg bg-[var(--color-success)] text-white text-sm font-bold"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleStatChange(player.id, 'points', 2)}
                          className="w-9 h-9 rounded-lg bg-[var(--color-accent)] text-white text-sm font-bold"
                        >
                          +2
                        </button>
                        <button
                          onClick={() => handleStatChange(player.id, 'points', 3)}
                          className="w-9 h-9 rounded-lg bg-purple-600 text-white text-sm font-bold"
                        >
                          +3
                        </button>
                      </>
                    )}
                    {permissions.canFoul && (
                      <button
                        onClick={() => handleFoulPlayer(player.id)}
                        className={`w-9 h-9 rounded-lg bg-[var(--color-warning)] text-black text-sm font-bold ${
                          player.fouls >= 5 ? 'ring-2 ring-[var(--color-danger)]' : ''
                        }`}
                      >
                        F{player.fouls}
                      </button>
                    )}
                    {!permissions.canScore && !permissions.canFoul && (
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {language === 'en' ? 'View only' : '仅查看'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded stats - only show if user can score */}
                {expandedPlayer === player.id && permissions.canScore && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-bg-primary)] grid grid-cols-5 gap-2">
                    <MobileStatButton
                      label={t.assists}
                      value={player.assists}
                      onIncrement={() => handleStatChange(player.id, 'assists', 1)}
                      onDecrement={() => handleStatChange(player.id, 'assists', -1)}
                    />
                    <MobileStatButton
                      label={t.rebounds}
                      value={player.rebounds}
                      onIncrement={() => handleStatChange(player.id, 'rebounds', 1)}
                      onDecrement={() => handleStatChange(player.id, 'rebounds', -1)}
                    />
                    <MobileStatButton
                      label={t.steals}
                      value={player.steals}
                      onIncrement={() => handleStatChange(player.id, 'steals', 1)}
                      onDecrement={() => handleStatChange(player.id, 'steals', -1)}
                    />
                    <MobileStatButton
                      label={t.blocks}
                      value={player.blocks}
                      onIncrement={() => handleStatChange(player.id, 'blocks', 1)}
                      onDecrement={() => handleStatChange(player.id, 'blocks', -1)}
                    />
                    <MobileStatButton
                      label={t.turnovers}
                      value={player.turnovers}
                      onIncrement={() => handleStatChange(player.id, 'turnovers', 1)}
                      onDecrement={() => handleStatChange(player.id, 'turnovers', -1)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tablet/Desktop: Table layout with horizontal scroll */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="sticky top-0 bg-[var(--color-bg-secondary)]">
                <tr className="text-[var(--color-text-secondary)]">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">{t.playerName}</th>
                  <th className="text-center p-2">🏀</th>
                  <th className="text-center p-2">{t.points}</th>
                  <th className="text-center p-2">{t.fouls}</th>
                  <th className="text-center p-2">{t.assists}</th>
                  <th className="text-center p-2">{t.rebounds}</th>
                  <th className="text-center p-2">{t.steals}</th>
                  <th className="text-center p-2">{t.blocks}</th>
                  <th className="text-center p-2">{t.turnovers}</th>
                  <th className="text-center p-2"></th>
                </tr>
              </thead>
              <tbody>
                {teamState.players.map((player) => (
                  <tr
                    key={player.id}
                    className={`border-b border-[var(--color-bg-secondary)] ${
                      player.isOnCourt ? 'bg-[var(--color-bg-secondary)]/30' : ''
                    }`}
                  >
                    {/* Editable number */}
                    <td className="p-2 font-bold">
                      {editingPlayer === player.id ? (
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-12 px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-accent)] text-center"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => startEditing(player)}
                          className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
                          title={language === 'en' ? 'Click to edit' : '点击编辑'}
                        >
                          {player.number}
                        </span>
                      )}
                    </td>
                    {/* Editable name */}
                    <td className="p-2">
                      {editingPlayer === player.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-accent)]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditing(player.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                          />
                          <button
                            onClick={() => saveEditing(player.id)}
                            className="w-6 h-6 rounded bg-[var(--color-success)] text-white text-xs"
                            title={language === 'en' ? 'Save' : '保存'}
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="w-6 h-6 rounded bg-[var(--color-danger)] text-white text-xs"
                            title={language === 'en' ? 'Cancel' : '取消'}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => startEditing(player)}
                          className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
                          title={language === 'en' ? 'Click to edit' : '点击编辑'}
                        >
                          {player.name}
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => togglePlayerOnCourt(currentTeam, player.id)}
                        className={`w-6 h-6 rounded-full ${
                          player.isOnCourt
                            ? 'bg-[var(--color-success)]'
                            : 'bg-[var(--color-bg-secondary)]'
                        }`}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-1">
                        {permissions.canScore ? (
                          <>
                            <button
                              onClick={() => handleStatChange(player.id, 'points', -1)}
                              className="w-6 h-6 rounded bg-[var(--color-danger)] text-white text-xs font-bold"
                              title="-1"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{player.points}</span>
                            <button
                              onClick={() => handleStatChange(player.id, 'points', 1)}
                              className="w-7 h-7 rounded bg-[var(--color-success)] text-white text-xs font-bold"
                              title="+1 (罚球)"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleStatChange(player.id, 'points', 2)}
                              className="w-7 h-7 rounded bg-[var(--color-accent)] text-white text-xs font-bold"
                              title="+2 (两分球)"
                            >
                              +2
                            </button>
                            <button
                              onClick={() => handleStatChange(player.id, 'points', 3)}
                              className="w-7 h-7 rounded bg-purple-600 text-white text-xs font-bold"
                              title="+3 (三分球)"
                            >
                              +3
                            </button>
                          </>
                        ) : (
                          <span className="w-8 text-center font-bold text-lg">{player.points}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`w-8 text-center font-bold ${
                            player.fouls >= 5 ? 'text-[var(--color-danger)]' : ''
                          }`}
                        >
                          {player.fouls}
                        </span>
                        {permissions.canFoul && (
                          <button
                            onClick={() => handleFoulPlayer(player.id)}
                            className="w-6 h-6 rounded bg-[var(--color-warning)] text-black text-xs"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </td>
                    <StatCell
                      value={player.assists}
                      onIncrement={() => handleStatChange(player.id, 'assists', 1)}
                      onDecrement={() => handleStatChange(player.id, 'assists', -1)}
                      canEdit={permissions.canScore}
                    />
                    <StatCell
                      value={player.rebounds}
                      onIncrement={() => handleStatChange(player.id, 'rebounds', 1)}
                      onDecrement={() => handleStatChange(player.id, 'rebounds', -1)}
                      canEdit={permissions.canScore}
                    />
                    <StatCell
                      value={player.steals}
                      onIncrement={() => handleStatChange(player.id, 'steals', 1)}
                      onDecrement={() => handleStatChange(player.id, 'steals', -1)}
                      canEdit={permissions.canScore}
                    />
                    <StatCell
                      value={player.blocks}
                      onIncrement={() => handleStatChange(player.id, 'blocks', 1)}
                      onDecrement={() => handleStatChange(player.id, 'blocks', -1)}
                      canEdit={permissions.canScore}
                    />
                    <StatCell
                      value={player.turnovers}
                      onIncrement={() => handleStatChange(player.id, 'turnovers', 1)}
                      onDecrement={() => handleStatChange(player.id, 'turnovers', -1)}
                      canEdit={permissions.canScore}
                    />
                    <td className="p-2">
                      {permissions.canEditPlayers && (
                        <button
                          onClick={() => removePlayer(currentTeam, player.id)}
                          className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 rounded p-1"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add player form - only show if user can edit players */}
          {permissions.canEditPlayers && (
            <div className="mt-4 flex gap-2 items-center flex-wrap sm:flex-nowrap">
              <input
                type="text"
                placeholder={t.playerNumber}
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
                className="w-16 sm:w-16 px-2 py-2 sm:py-1 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)] text-sm"
              />
              <input
                type="text"
                placeholder={t.playerName}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 min-w-0 px-2 py-2 sm:py-1 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-text-secondary)] text-sm"
              />
              <button
                onClick={handleAddPlayer}
                className="px-4 py-2 sm:py-1 rounded bg-[var(--color-success)] text-white font-semibold hover:bg-green-600 text-sm whitespace-nowrap"
              >
                + {t.players}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile stat button component
interface MobileStatButtonProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function MobileStatButton({ label, value, onIncrement, onDecrement }: MobileStatButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-[var(--color-text-secondary)] mb-1">{label}</span>
      <div className="flex items-center gap-0.5">
        <button
          onClick={onDecrement}
          className="w-6 h-6 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-xs"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-bold">{value}</span>
        <button
          onClick={onIncrement}
          className="w-6 h-6 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-xs"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Desktop stat cell component
interface StatCellProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canEdit?: boolean;
}

function StatCell({ value, onIncrement, onDecrement, canEdit = true }: StatCellProps) {
  return (
    <td className="p-2">
      <div className="flex items-center justify-center gap-1">
        {canEdit ? (
          <>
            <button
              onClick={onDecrement}
              className="w-5 h-5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs hover:bg-slate-600"
            >
              -
            </button>
            <span className="w-6 text-center">{value}</span>
            <button
              onClick={onIncrement}
              className="w-5 h-5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs hover:bg-slate-600"
            >
              +
            </button>
          </>
        ) : (
          <span className="w-6 text-center">{value}</span>
        )}
      </div>
    </td>
  );
}
