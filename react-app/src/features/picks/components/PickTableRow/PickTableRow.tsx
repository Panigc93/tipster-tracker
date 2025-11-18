/**
 * @fileoverview PickTableRow component - Table row for displaying pick data
 * @module features/picks/components/PickTableRow
 */

import { Edit2, Trash2, UserPlus, Check } from 'lucide-react';
import { Badge, Button } from '@shared/components/ui';
import { getSportIcon } from '../../utils/sport-icons';
import type { PickTableRowProps } from './PickTableRow.types';

/**
 * Calculate pick profit based on result, odds and stake
 */
const calculateProfit = (result: string, odds: number, stake: number): number => {
  if (result === 'Ganada') {
    return (odds - 1) * stake;
  } else if (result === 'Perdida') {
    return -stake;
  }
  return 0; // Void or Pendiente
};

/**
 * Get result badge variant based on result
 */
const getResultVariant = (result: string): 'success' | 'error' | 'warning' | 'info' => {
  switch (result) {
    case 'Ganada':
      return 'success';
    case 'Perdida':
      return 'error';
    case 'Void':
      return 'warning';
    case 'Pendiente':
    default:
      return 'info';
  }
};

/**
 * Format date to DD/MM/YYYY
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * PickTableRow component
 * Displays a pick as a table row with all relevant information
 */
export function PickTableRow({
  pick,
  tipsterName,
  onEdit,
  onDelete,
  onFollow,
  isFollowed = false,
  showActions = true,
}: PickTableRowProps) {
  const profit = calculateProfit(pick.result, pick.odds, pick.stake);
  const sportIcon = getSportIcon(pick.sport);

  const handleEdit = () => {
    onEdit?.(pick);
  };

  const handleDelete = () => {
    onDelete?.(pick);
  };

  const handleFollow = () => {
    onFollow?.(pick);
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
      {/* Fecha */}
      <td className="px-4 py-3 text-sm text-slate-300">
        {formatDate(pick.date)}
        {pick.time && (
          <div className="text-xs text-slate-500 mt-0.5">{pick.time}</div>
        )}
      </td>

      {/* Tipster */}
      <td className="px-4 py-3 text-sm text-slate-200 font-medium">
        {tipsterName}
      </td>

      {/* Match */}
      <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px]">
        <div className="truncate" title={pick.match}>
          {pick.match}
        </div>
      </td>

      {/* Sport */}
      <td className="px-4 py-3 text-sm text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-base">{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
      </td>

      {/* Pick Type */}
      <td className="px-4 py-3 text-sm text-slate-300">
        <Badge variant="info" size="sm">
          {pick.pickType}
        </Badge>
      </td>

      {/* Bet Type */}
      <td className="px-4 py-3 text-sm text-slate-300 max-w-[150px]">
        <div className="truncate" title={pick.betType}>
          {pick.betType}
        </div>
      </td>

      {/* Odds */}
      <td className="px-4 py-3 text-sm text-slate-200 font-mono font-semibold">
        {pick.odds.toFixed(2)}
      </td>

      {/* Stake */}
      <td className="px-4 py-3 text-sm text-slate-200 font-mono font-semibold">
        {pick.stake}u
      </td>

      {/* Bookmaker */}
      <td className="px-4 py-3 text-sm text-slate-300">
        {pick.bookmaker}
      </td>

      {/* Result */}
      <td className="px-4 py-3">
        <Badge variant={getResultVariant(pick.result)} size="sm">
          {pick.result}
        </Badge>
      </td>

      {/* Profit */}
      <td className="px-4 py-3 text-sm font-mono font-semibold">
        {(() => {
          const profitColor =
            profit > 0 ? 'text-green-400' : profit < 0 ? 'text-red-400' : 'text-slate-400';
          return (
            <span className={profitColor}>
              {profit > 0 ? '+' : ''}
              {profit.toFixed(2)}u
            </span>
          );
        })()}
      </td>

      {/* Actions */}
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {onFollow && !isFollowed && (
              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus className="h-3.5 w-3.5" />}
                onClick={handleFollow}
                aria-label="Seguir pick"
              >
                Seguir
              </Button>
            )}
            {isFollowed && (
              <Button
                variant="success"
                size="sm"
                icon={<Check className="h-3.5 w-3.5" />}
                disabled
                aria-label="Pick ya seguido"
              >
                Seguido
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit2 className="h-3.5 w-3.5" />}
              onClick={handleEdit}
              aria-label="Editar pick"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={handleDelete}
              aria-label="Eliminar pick"
            >
              Eliminar
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
}
