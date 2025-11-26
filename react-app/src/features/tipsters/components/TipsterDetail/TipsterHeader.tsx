import { Edit2, Trash2, RefreshCcw } from 'lucide-react';
import { Button, Badge } from '@/shared/components';
import type { Tipster } from '@/shared/types';

interface TipsterHeaderProps {
  tipster: Tipster;
  onEdit: () => void;
  onReset: () => void;
  onDelete: () => void;
  isResetting: boolean;
  isDeleting: boolean;
  hasPicks: boolean;
}

export function TipsterHeader({
  tipster,
  onEdit,
  onReset,
  onDelete,
  isResetting,
  isDeleting,
  hasPicks,
}: TipsterHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-200">
          {tipster.name}
        </h1>
        <Badge variant="info">{tipster.channel}</Badge>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="xs"
          icon={<Edit2 className="h-3 w-3" />}
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="xs"
          icon={<RefreshCcw className="h-3 w-3" />}
          onClick={onReset}
          disabled={isResetting || !hasPicks}
          title={!hasPicks ? 'No hay picks para resetear' : 'Resetear tipster'}
        >
          {isResetting ? 'Reseteando...' : 'Resetear'}
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
          icon={<Trash2 className="h-3 w-3" />}
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  );
}
