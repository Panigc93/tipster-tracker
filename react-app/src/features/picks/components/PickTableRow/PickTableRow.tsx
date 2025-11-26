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
 * Get profit color class based on profit value
 */
const getProfitColor = (profit: number): string => {
  if (profit > 0) return 'text-green-400';
  if (profit < 0) return 'text-red-400';
  return 'text-slate-400';
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

// Common CSS classes
const TD_BASE = 'px-4 py-1 text-sm';
const TD_NORMAL = `${TD_BASE} text-slate-300`;
const TD_HIGHLIGHT = `${TD_BASE} text-slate-200 font-semibold`;

/**
 * Simple table cell component
 */
interface TableCellProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const TableCell = ({ className = TD_NORMAL, children, title }: TableCellProps) => (
  <td className={className} title={title}>
    {children}
  </td>
);

/**
 * Truncated table cell component
 */
const TruncatedCell = ({ text, maxWidth }: { text: string; maxWidth: string }) => (
  <TableCell className={`${TD_NORMAL} ${maxWidth}`}>
    <div className="truncate" title={text}>
      {text}
    </div>
  </TableCell>
);

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

  return (
    <tr className="bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
      {/* Fecha */}
      <TableCell>
        {formatDate(pick.date)}
        {pick.time && (
          <div className="text-xs text-slate-500">{pick.time}</div>
        )}
      </TableCell>

      {/* Tipster */}
      <TableCell className={`${TD_BASE} text-slate-200 font-medium`}>
        {tipsterName}
      </TableCell>

      {/* Match */}
      <TruncatedCell text={pick.match} maxWidth="max-w-[200px]" />

      {/* Sport */}
      <TableCell>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-base">{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
      </TableCell>

      {/* Pick Type */}
      <TableCell>
        <Badge variant="info" size="sm">
          {pick.pickType}
        </Badge>
      </TableCell>

      {/* Bet Type */}
      <TruncatedCell text={pick.betType} maxWidth="max-w-[150px]" />

      {/* Odds */}
      <TableCell className={TD_HIGHLIGHT}>
        {pick.odds.toFixed(2)}
      </TableCell>

      {/* Stake */}
      <TableCell className={TD_HIGHLIGHT}>
        {pick.stake}u
      </TableCell>

      {/* Bookmaker */}
      <TableCell>{pick.bookmaker}</TableCell>

      {/* Result */}
      <TableCell className={TD_BASE}>
        <Badge variant={getResultVariant(pick.result)} size="sm">
          {pick.result}
        </Badge>
      </TableCell>

      {/* Profit */}
      <TableCell className={`${TD_BASE} font-semibold`}>
        <span className={getProfitColor(profit)}>
          {profit > 0 && '+'}
          {profit.toFixed(2)}u
        </span>
      </TableCell>

      {/* Actions */}
      {showActions && (
        <td className="px-4 py-2">
          <div className="flex items-center justify-end gap-1">
            {onFollow && !isFollowed && (
              <Button
                onClick={() => onFollow(pick)}
                variant="transparent"
                aria-label="Seguir pick"
                title="Seguir pick"
                className="py-2"
                icon={<UserPlus className="h-4 w-4 text-blue-400" />}
                size="xs"
              />
            )}
            {isFollowed && (
              <div
                className="p-2 rounded-full text-green-400"
                aria-label="Pick ya seguido"
                title="Pick seguido"
              >
                <Check className="h-5 w-5" />
              </div>
            )}
            <Button
              onClick={() => onEdit?.(pick)}
              variant="transparent"
              aria-label="Editar pick"
              title="Editar pick"
              className="py-2"
              icon={<Edit2 className="h-4 w-4" />}
              size="xs"
            />
            <Button
              onClick={() => onDelete?.(pick)}
              variant="transparent"
              aria-label="Eliminar pick"
              title="Eliminar pick"
              className="py-2"
              icon={<Trash2 className="h-4 w-4 text-red-500" />}
              size="xs"
            />
          </div>
        </td>
      )}
    </tr>
  );
}
