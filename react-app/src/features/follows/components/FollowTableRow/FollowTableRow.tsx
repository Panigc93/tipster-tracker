import { Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@shared/components/ui';
import { formatDate } from '@shared/utils/date.utils';
import { getSportIcon } from '@features/picks/utils/sport-icons';
import type { FollowTableRowProps } from './FollowTableRow.types';
import type { BadgeVariant } from '@shared/components/ui/Badge/Badge.types';

/**
 * Calculate profit from a pick
 * Formula:
 * - Ganada: (odds - 1) * stake
 * - Perdida: -stake
 * - Void/Pendiente: 0
 */
function calculateProfit(odds: number, stake: number, result: string): number {
  const normalizedResult = result.toLowerCase();
  
  if (normalizedResult === 'ganada') {
    return (odds - 1) * stake;
  } else if (normalizedResult === 'perdida') {
    return -stake;
  }
  // Void or Pendiente
  return 0;
}

/**
 * Get badge variant based on result
 */
function getResultVariant(result: string): BadgeVariant {
  const normalizedResult = result.toLowerCase();
  
  switch (normalizedResult) {
    case 'ganada':
      return 'success';
    case 'perdida':
      return 'error';
    case 'void':
      return 'warning';
    case 'pendiente':
    default:
      return 'info';
  }
}

/**
 * Check if user result matches tipster result
 */
function isMatch(tipsterResult: string, userResult: string): boolean {
  return tipsterResult.toLowerCase() === userResult.toLowerCase();
}

/**
 * FollowTableRow Component
 * Displays a follow in a table row with comparison between tipster and user data
 *
 * Columns:
 * - Fecha
 * - Tipster
 * - Match
 * - Deporte
 * - Cuota (Tipster / Usuario)
 * - Stake (Tipster / Usuario)
 * - Resultado (Tipster / Usuario)
 * - Profit (Tipster / Usuario)
 * - Match/Diverge indicator
 * - Acciones (edit/delete)
 */
export function FollowTableRow({
  follow,
  pick,
  tipsterName,
  onEdit,
  onDelete,
  showActions = true,
}: FollowTableRowProps) {
  const sportIcon = getSportIcon(pick.sport);
  
  // Calculate profits
  const tipsterProfit = calculateProfit(pick.odds, pick.stake, pick.result);
  const userProfit = calculateProfit(follow.userOdds, follow.userStake, follow.userResult);
  
  // Check if results match
  const resultsMatch = isMatch(pick.result, follow.userResult);
  
  // Profit colors
  const tipsterProfitClass = tipsterProfit > 0 ? 'text-green-400' : tipsterProfit < 0 ? 'text-red-400' : 'text-slate-400';
  const userProfitClass = userProfit > 0 ? 'text-green-400' : userProfit < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <tr className="hover:bg-slate-700/50 transition-colors">
      {/* Fecha */}
      <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
        {formatDate(follow.dateFollowed)}
      </td>

      {/* Tipster */}
      <td className="px-4 py-3 text-sm text-slate-200 font-medium">
        {tipsterName}
      </td>

      {/* Match */}
      <td className="px-4 py-3 text-sm text-slate-200">
        {pick.match}
      </td>

      {/* Deporte */}
      <td className="px-4 py-3 text-sm text-slate-300">
        <span className="flex items-center gap-1">
          <span>{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
      </td>

      {/* Cuota (Tipster / Usuario) */}
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-xs">Tip:</span>
          <span className="text-slate-200">{pick.odds.toFixed(2)}</span>
          <span className="text-slate-400 text-xs mt-1">Usuario:</span>
          <span className={follow.userOdds === pick.odds ? 'text-slate-200' : 'text-blue-400'}>
            {follow.userOdds.toFixed(2)}
          </span>
        </div>
      </td>

      {/* Stake (Tipster / Usuario) */}
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-xs">Tip:</span>
          <span className="text-slate-200">{pick.stake}</span>
          <span className="text-slate-400 text-xs mt-1">Usuario:</span>
          <span className={follow.userStake === pick.stake ? 'text-slate-200' : 'text-blue-400'}>
            {follow.userStake}
          </span>
        </div>
      </td>

      {/* Resultado (Tipster / Usuario) */}
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs">Tip:</span>
            <Badge variant={getResultVariant(pick.result)} size="sm">
              {pick.result}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs">User:</span>
            <Badge variant={getResultVariant(follow.userResult)} size="sm">
              {follow.userResult}
            </Badge>
          </div>
        </div>
      </td>

      {/* Profit (Tipster / Usuario) */}
      <td className="px-4 py-3 text-sm font-medium">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-xs">Tip:</span>
          <span className={tipsterProfitClass}>
            {tipsterProfit > 0 && '+'}
            {tipsterProfit.toFixed(2)}
          </span>
          <span className="text-slate-400 text-xs mt-1">Usuario:</span>
          <span className={userProfitClass}>
            {userProfit > 0 && '+'}
            {userProfit.toFixed(2)}
          </span>
        </div>
      </td>

      {/* Match/Diverge Indicator */}
      <td className="px-4 py-3 text-sm text-center">
        {resultsMatch ? (
          <Badge variant="success" size="sm">Match</Badge>
        ) : (
          <Badge variant="warning" size="sm">Diverge</Badge>
        )}
      </td>

      {/* Acciones */}
      {showActions && (onEdit || onDelete) && (
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(follow)}
                className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                aria-label="Editar follow"
                title="Editar follow"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(follow)}
                className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                aria-label="Eliminar follow"
                title="Eliminar follow"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
