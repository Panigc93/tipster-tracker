import { PickTableRow, PickCard } from '@/features/picks/components';
import { useSortableTable } from '@/shared/hooks';
import type { Pick } from '@/shared/types';

interface PicksHistoryProps {
  picks: Pick[];
  tipsterName: string;
  onEdit: (pick: Pick) => void;
  onDelete: (pick: Pick) => void;
}

export function PicksHistory({ picks, tipsterName, onEdit, onDelete }: PicksHistoryProps) {
  const { 
    sortedData: sortedPicks, 
    requestSort: requestPicksSort, 
    getSortIndicator: getPicksSortIndicator 
  } = useSortableTable<Pick>(picks, 'date', 'desc');

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-200 mb-4">
        Historial de Picks ({picks.length})
      </h2>
      
      <div className="md:hidden space-y-4">
        {sortedPicks.map((pick) => (
          <PickCard
            key={pick.id}
            pick={pick}
            tipsterName={tipsterName}
            showActions={true}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden md:block bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-500/10 border-b border-slate-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestPicksSort('date')}
                  title="Click para ordenar por fecha. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Fecha {getPicksSortIndicator('date')}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tipster
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Partido
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestPicksSort('sport')}
                  title="Click para ordenar por deporte. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Deporte {getPicksSortIndicator('sport')}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Apuesta
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestPicksSort('odds')}
                  title="Click para ordenar por cuota. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Cuota {getPicksSortIndicator('odds')}
                  </span>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestPicksSort('stake')}
                  title="Click para ordenar por stake. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Stake {getPicksSortIndicator('stake')}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Bookmaker
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Profit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedPicks.map((pick) => (
                <PickTableRow
                  key={pick.id}
                  pick={pick}
                  tipsterName={tipsterName}
                  showActions={true}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
