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
    <div className="mb-2 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-200 mb-2">
          {tipster.name}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant="info">{tipster.channel}</Badge>
          <span className="text-sm text-slate-400">
            Creado: {new Date(tipster.createdDate).toLocaleDateString()}
          </span>
          {tipster.lastPickDate && (
            <span className="text-sm text-slate-400">
              Última pick:{' '}
              {new Date(tipster.lastPickDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Edit2 className="h-4 w-4" />}
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCcw className="h-4 w-4" />}
          onClick={onReset}
          disabled={isResetting || !hasPicks}
          title={!hasPicks ? 'No hay picks para resetear' : 'Resetear tipster'}
        >
          {isResetting ? 'Reseteando...' : 'Resetear'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  );
}
