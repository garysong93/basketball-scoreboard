import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getPermissions, type RefereeRole, type RefereePermissions } from '../utils/refereeRoles';

export function usePermissions(): RefereePermissions & { role: RefereeRole } {
  // Get sync state directly from gameStore - this is shared across all components
  const syncMode = useGameStore((state) => state.syncMode);
  const refereeRole = useGameStore((state) => state.refereeRole);

  const permissions = useMemo(() => {
    // If not syncing, user has full permissions (local mode)
    if (syncMode === 'local') {
      return {
        role: 'host' as RefereeRole,
        canScore: true,
        canFoul: true,
        canTimeout: true,
        canTimer: true,
        canPeriod: true,
        canPossession: true,
        canEditPlayers: true,
        canEditSettings: true,
      };
    }

    // If hosting, full permissions
    if (syncMode === 'host') {
      return {
        role: 'host' as RefereeRole,
        ...getPermissions('host'),
      };
    }

    // If viewer, use the referee role
    const role = refereeRole || 'viewer';
    return {
      role,
      ...getPermissions(role),
    };
  }, [syncMode, refereeRole]);

  return permissions;
}
