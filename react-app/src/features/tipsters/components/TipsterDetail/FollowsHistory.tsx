import { FollowTableRow, FollowCard } from '@/features/follows/components';
import { useSortableTable } from '@/shared/hooks';
import type { UserFollow, Pick } from '@/shared/types';

interface FollowsHistoryProps {
  follows: UserFollow[];
  picks: Pick[];
  tipsterName: string;
  onEdit: (follow: UserFollow) => void;
  onDelete: (follow: UserFollow) => void;
}

export function FollowsHistory({ follows, picks, tipsterName, onEdit, onDelete }: FollowsHistoryProps) {
  const enrichedFollows = follows.map(follow => {
    const originalPick = picks.find(p => p.id === follow.pickId);
    return {
      ...follow,
      sport: originalPick?.sport || '',
    };
  });

  const { 
    sortedData: sortedFollows, 
    requestSort: requestFollowsSort, 
    getSortIndicator: getFollowsSortIndicator 
  } = useSortableTable(enrichedFollows, 'dateTimeFollowed', 'desc');

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-200 mb-4">
        Historial de Picks Seguidas ({follows.length})
      </h2>
      
      <div className="md:hidden space-y-4">
        {sortedFollows.map((follow) => {
          const originalPick = picks.find((p) => p.id === follow.pickId);
          if (!originalPick) return null;

          return (
            <FollowCard
              key={follow.id}
              follow={follow}
              pick={originalPick}
              tipsterName={tipsterName}
              onEdit={() => onEdit(follow)}
              onDelete={() => onDelete(follow)}
            />
          );
        })}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-500/10 border-b border-slate-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestFollowsSort('dateTimeFollowed')}
                  title="Click para ordenar por fecha. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Fecha {getFollowsSortIndicator('dateTimeFollowed')}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tipster
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Match
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestFollowsSort('sport')}
                  title="Click para ordenar por deporte. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Deporte {getFollowsSortIndicator('sport')}
                  </span>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestFollowsSort('userOdds')}
                  title="Click para ordenar por cuota. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Cuota {getFollowsSortIndicator('userOdds')}
                  </span>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                  onClick={() => requestFollowsSort('userStake')}
                  title="Click para ordenar por stake. Click en otra columna para multi-sort"
                >
                  <span className="flex items-center gap-1">
                    Stake {getFollowsSortIndicator('userStake')}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedFollows.map((follow) => {
                const originalPick = picks.find((p) => p.id === follow.pickId);
                if (!originalPick) return null;

                return (
                  <FollowTableRow
                    key={follow.id}
                    follow={follow}
                    pick={originalPick}
                    tipsterName={tipsterName}
                    onEdit={() => onEdit(follow)}
                    onDelete={() => onDelete(follow)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
