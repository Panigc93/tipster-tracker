/**
 * @fileoverview PickCard component - Card view for displaying pick data on mobile
 * @module features/picks/components/PickCard
 */

import { memo } from 'react';
import { Edit2, Trash2, UserPlus, Check, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@shared/components/ui';
import { getSportIcon } from '../../utils/sport-icons';
import type { PickCardProps } from './PickCard.types';

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
 * PickCard component
 * Displays a pick as a card for mobile view
 * Memoized to prevent unnecessary re-renders in lists
 */
const PickCardComponent = ({
  pick,
  tipsterName,
  onEdit,
  onDelete,
  onFollow,
  isFollowed = false,
  showActions = true,
}: PickCardProps) => {
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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      {/* Header: Match + Result */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate" title={pick.match}>
            {pick.match}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">{tipsterName}</p>
        </div>
        <Badge variant={getResultVariant(pick.result)} size="sm">
          {pick.result}
        </Badge>
      </div>

      {/* Date + Time */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(pick.date)}</span>
        {pick.time && <span className="text-slate-500">• {pick.time}</span>}
      </div>

      {/* Sport + Pick Type */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-300">
          <span className="text-base">{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
        <Badge variant="info" size="sm">
          {pick.pickType}
        </Badge>
      </div>

      {/* Bet Type */}
      <div className="text-sm">
        <span className="text-slate-400">Apuesta: </span>
        <span className="text-slate-200">{pick.betType}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
        <div>
          <div className="text-xs text-slate-400 mb-1">Cuota</div>
          <div className="text-lg font-mono font-semibold text-slate-200">
            {pick.odds.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Stake</div>
          <div className="text-lg font-mono font-semibold text-slate-200">
            {pick.stake}u
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Casa</div>
          <div className="text-sm text-slate-200 truncate" title={pick.bookmaker}>
            {pick.bookmaker}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Beneficio
          </div>
          <div
            className={`text-lg font-mono font-semibold ${
              profit > 0 ? 'text-green-400' : profit < 0 ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {profit > 0 ? '+' : ''}
            {profit.toFixed(2)}u
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          {onFollow && !isFollowed && (
            <button
              onClick={handleFollow}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              aria-label="Seguir pick"
            >
              <UserPlus className="h-4 w-4" />
              Seguir
            </button>
          )}
          {isFollowed && (
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-green-600/30 text-green-400 text-sm font-medium">
              <Check className="h-4 w-4" />
              Seguido
            </div>
          )}
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
            aria-label="Editar pick"
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            aria-label="Eliminar pick"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Memoized PickCard to prevent unnecessary re-renders
 */
export const PickCard = memo(PickCardComponent);
