/**
 * @fileoverview PicksTableHeader - Table header with sortable columns
 * @module shared/components/PicksTable
 */

import type { PicksTableMode, PicksTableColumns } from './PicksTable.types';

interface PicksTableHeaderProps {
  readonly mode: PicksTableMode;
  readonly columns: PicksTableColumns;
  readonly requestSort: (key: string) => void;
  readonly getSortIndicator: (key: string) => string;
}

export function PicksTableHeader({
  mode,
  columns,
  requestSort,
  getSortIndicator,
}: PicksTableHeaderProps) {
  const baseClass = "px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider";
  const sortableClass = `${baseClass} cursor-pointer hover:bg-blue-500/20 transition-colors select-none`;
  const normalClass = baseClass;

  return (
    <thead className="bg-blue-400/20 border-b border-slate-600">
      <tr>
        {/* Date */}
        {columns.date && (
          <th 
            className={sortableClass}
            onClick={() => requestSort(mode === 'picks' ? 'date' : 'dateTimeFollowed')}
            title="Click para ordenar por fecha. Click en otra columna para multi-sort"
          >
            <span className="flex items-center gap-1">
              Fecha {getSortIndicator(mode === 'picks' ? 'date' : 'dateTimeFollowed')}
            </span>
          </th>
        )}

        {/* Tipster */}
        {columns.tipster && (
          <th 
            className={mode === 'picks' ? sortableClass : normalClass}
            {...(mode === 'picks' && {
              onClick: () => requestSort('tipsterId'),
              title: "Click para ordenar por tipster. Click en otra columna para multi-sort"
            })}
          >
            <span className="flex items-center gap-1">
              Tipster {mode === 'picks' && getSortIndicator('tipsterId')}
            </span>
          </th>
        )}

        {/* Match */}
        {columns.match && (
          <th className={normalClass}>
            Partido
          </th>
        )}

        {/* Sport */}
        {columns.sport && (
          <th 
            className={sortableClass}
            onClick={() => requestSort('sport')}
            title="Click para ordenar por deporte. Click en otra columna para multi-sort"
          >
            <span className="flex items-center gap-1">
              Deporte {getSortIndicator('sport')}
            </span>
          </th>
        )}

        {/* Pick Type */}
        {columns.pickType && (
          <th className={normalClass}>
            Tipo
          </th>
        )}

        {/* Bet Type */}
        {columns.betType && (
          <th className={normalClass}>
            Apuesta
          </th>
        )}

        {/* Odds */}
        {columns.odds && (
          <th 
            className={sortableClass}
            onClick={() => requestSort(mode === 'picks' ? 'odds' : 'userOdds')}
            title="Click para ordenar por cuota. Click en otra columna para multi-sort"
          >
            <span className="flex items-center gap-1">
              {mode === 'follows' ? 'Cuota (T/U)' : 'Cuota'} {getSortIndicator(mode === 'picks' ? 'odds' : 'userOdds')}
            </span>
          </th>
        )}

        {/* Stake */}
        {columns.stake && (
          <th 
            className={sortableClass}
            onClick={() => requestSort(mode === 'picks' ? 'stake' : 'userStake')}
            title="Click para ordenar por stake. Click en otra columna para multi-sort"
          >
            <span className="flex items-center gap-1">
              {mode === 'follows' ? 'Stake (T/U)' : 'Stake'} {getSortIndicator(mode === 'picks' ? 'stake' : 'userStake')}
            </span>
          </th>
        )}

        {/* Bookmaker */}
        {columns.bookmaker && (
          <th className={normalClass}>
            Bookmaker
          </th>
        )}

        {/* Result */}
        {columns.result && (
          <th className={normalClass}>
            {mode === 'follows' ? 'Resultado (T/U)' : 'Resultado'}
          </th>
        )}

        {/* Profit */}
        {columns.profit && (
          <th className={normalClass}>
            {mode === 'follows' ? 'Profit (T/U)' : 'Profit'}
          </th>
        )}

        {/* Match Comparison (only for follows) */}
        {columns.matchComparison && mode === 'follows' && (
          <th className={normalClass}>
            Match
          </th>
        )}

        {/* Actions */}
        {columns.actions && (
          <th className={`${normalClass} text-right`}>
            Acciones
          </th>
        )}
      </tr>
    </thead>
  );
}
