import { useMemo } from 'react';
import { useSync } from './useSync';
import { getPermissions, type RefereeRole, type RefereePermissions } from '../utils/refereeRoles';

export function usePermissions(): RefereePermissions & { role: RefereeRole } {
  const { syncMode, refereeRole } = useSync();

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
