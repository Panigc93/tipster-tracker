import { PicksTable } from '@/shared/components';
import type { UserFollow, Pick } from '@/shared/types';

interface FollowsHistoryProps {
  follows: UserFollow[];
  picks: Pick[];
  tipsterName: string;
  onEdit: (follow: UserFollow) => void;
  onDelete: (follow: UserFollow) => void;
}

export function FollowsHistory({ follows, picks, tipsterName, onEdit, onDelete }: FollowsHistoryProps) {
  return (
    <PicksTable
      mode="follows"
      data={follows}
      picks={picks}
      getTipsterName={() => tipsterName}
      title="Historial de Picks Seguidas"
      showActions={true}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="No hay follows disponibles"
    />
  );
}
