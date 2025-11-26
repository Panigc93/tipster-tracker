import { Edit2, Trash2 } from 'lucide-react';
import { Badge, Button } from '@shared/components/ui';
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
 * FollowTableRow Component
 * Displays a follow in a table row with comparison between tipster and user data
 *
 * Columns:
 * - Fecha
 * - Tipster
 * - Match
 * - Deporte
 * - Apuesta (Bet Type)
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
  
  // Profit colors
  const tipsterProfitClass = tipsterProfit > 0 ? 'text-green-400' : tipsterProfit < 0 ? 'text-red-400' : 'text-slate-400';
  const userProfitClass = userProfit > 0 ? 'text-green-400' : userProfit < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <tr className="bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
      {/* Fecha */}
      <td className="px-4 py-1 text-sm text-slate-300 whitespace-nowrap">
        {formatDate(follow.dateFollowed)}
      </td>

      {/* Tipster */}
      <td className="px-4 py-1 text-sm text-slate-200 font-medium">
        {tipsterName}
      </td>

      {/* Match */}
      <td className="px-4 py-1 text-sm text-slate-200">
        {pick.match}
      </td>

      {/* Deporte */}
      <td className="px-4 py-1 text-sm text-slate-300">
        <span className="flex items-center gap-1">
          <span>{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
      </td>

      {/* Apuesta (Bet Type) */}
      <td className="px-4 py-1 text-sm text-slate-300">
        {pick.betType}
      </td>

      {/* Cuota (Tipster / Usuario) */}
      <td className="px-4 py-1 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-slate-200">{pick.odds.toFixed(2)}</span>
          <span className="text-slate-500">/</span>
          <span className={follow.userOdds === pick.odds ? 'text-slate-200' : 'text-blue-400'}>
            {follow.userOdds.toFixed(2)}
          </span>
        </div>
      </td>

      {/* Stake (Tipster / Usuario) */}
      <td className="px-4 py-1 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-slate-200">{pick.stake}u</span>
          <span className="text-slate-500">/</span>
          <span className={follow.userStake === pick.stake ? 'text-slate-200' : 'text-blue-400'}>
            {follow.userStake}u
          </span>
        </div>
      </td>

      {/* Resultado (Tipster / Usuario) */}
      <td className="px-4 py-1 text-sm">
        <div className="flex items-center gap-1">
          <Badge variant={getResultVariant(pick.result)} size="sm">
            {pick.result}
          </Badge>
          <span className="text-slate-500">/</span>
          <Badge variant={getResultVariant(follow.userResult)} size="sm">
            {follow.userResult}
          </Badge>
        </div>
      </td>

      {/* Profit (Tipster / Usuario) */}
      <td className="px-4 py-1 text-sm font-medium">
        <div className="flex items-center gap-1">
          <span className={tipsterProfitClass}>
            {tipsterProfit > 0 && '+'}
            {tipsterProfit.toFixed(2)}u
          </span>
          <span className="text-slate-500">/</span>
          <span className={userProfitClass}>
            {userProfit > 0 && '+'}
            {userProfit.toFixed(2)}u
          </span>
        </div>
      </td>

      {/* Acciones */}
      {showActions && (onEdit || onDelete) && (
        <td className="px-4 py-2">
          <div className="flex items-center justify-end gap-1">
            {onEdit && (
              <Button
                onClick={() => onEdit(follow)}
                variant="transparent"
                aria-label="Editar follow"
                title="Editar follow"
                className="py-2"
                icon={<Edit2 className="h-4 w-4" />}
                size="xs"
              />
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(follow)}
                variant="transparent"
                aria-label="Eliminar follow"
                title="Eliminar follow"
                className="py-2"
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                size="xs"
              />
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
