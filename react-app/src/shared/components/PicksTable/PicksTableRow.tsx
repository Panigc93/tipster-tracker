/**
 * @fileoverview PicksTableRow - Table row component for picks and follows
 * @module shared/components/PicksTable
 */

import { PickTableRow } from '@/features/picks/components';
import { FollowTableRow } from '@/features/follows/components';
import type { Pick, UserFollow } from '@/shared/types';
import type { PicksTableMode } from './PicksTable.types';

interface PicksTableRowProps {
  readonly mode: PicksTableMode;
  readonly item: Pick | UserFollow;
  readonly picks?: Pick[];
  readonly getTipsterName: (tipsterId: string) => string;
  readonly showActions: boolean;
  readonly onEdit?: (item: Pick | UserFollow) => void;
  readonly onDelete?: (item: Pick | UserFollow) => void;
  readonly onFollow?: (pick: Pick) => void;
  readonly isFollowed?: (pickId: string) => boolean;
}

export function PicksTableRow({
  mode,
  item,
  picks,
  getTipsterName,
  showActions,
  onEdit,
  onDelete,
  onFollow,
  isFollowed,
}: PicksTableRowProps) {
  if (mode === 'picks') {
    const pick = item as Pick;
    return (
      <PickTableRow
        pick={pick}
        tipsterName={getTipsterName(pick.tipsterId)}
        showActions={showActions}
        onEdit={onEdit ? () => onEdit(pick) : undefined}
        onDelete={onDelete ? () => onDelete(pick) : undefined}
        onFollow={onFollow ? () => onFollow(pick) : undefined}
        isFollowed={isFollowed ? isFollowed(pick.id) : false}
      />
    );
  } else {
    const follow = item as UserFollow;
    const originalPick = picks?.find(p => p.id === follow.pickId);
    
    if (!originalPick) return null;

    return (
      <FollowTableRow
        follow={follow}
        pick={originalPick}
        tipsterName={getTipsterName(follow.tipsterId)}
        onEdit={onEdit ? () => onEdit(follow) : undefined}
        onDelete={onDelete ? () => onDelete(follow) : undefined}
      />
    );
  }
}
