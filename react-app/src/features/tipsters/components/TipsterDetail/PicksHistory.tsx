import { PicksTable } from '@/shared/components';
import type { Pick } from '@/shared/types';

interface PicksHistoryProps {
  picks: Pick[];
  tipsterName: string;
  onEdit: (pick: Pick) => void;
  onDelete: (pick: Pick) => void;
}

export function PicksHistory({ picks, tipsterName, onEdit, onDelete }: PicksHistoryProps) {
  return (
    <PicksTable
      mode="picks"
      data={picks}
      getTipsterName={() => tipsterName}
      title="Historial de Picks"
      showActions={true}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="No hay picks disponibles"
    />
  );
}
