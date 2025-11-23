/**
 * @fileoverview FollowCard component - Card view for displaying follow data on mobile
 * @module features/follows/components/FollowCard
 */

import { memo } from 'react';
import { Edit2, Trash2, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@shared/components/ui';
import { formatDate } from '@shared/utils/date.utils';
import { getSportIcon } from '@features/picks/utils/sport-icons';
import type { FollowCardProps } from './FollowCard.types';
import type { BadgeVariant } from '@shared/components/ui/Badge/Badge.types';

/**
 * Calculate profit from a pick
 */
function calculateProfit(odds: number, stake: number, result: string): number {
  const normalizedResult = result.toLowerCase();
  
  if (normalizedResult === 'ganada') {
    return (odds - 1) * stake;
  } else if (normalizedResult === 'perdida') {
    return -stake;
  }
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
 * FollowCard component
 * Displays a follow as a card for mobile view with comparison between tipster and user data
 * Memoized to prevent unnecessary re-renders in lists
 */
const FollowCardComponent = ({
  follow,
  pick,
  tipsterName,
  onEdit,
  onDelete,
  showActions = true,
}: FollowCardProps) => {
  const sportIcon = getSportIcon(pick.sport);
  
  // Calculate profits
  const tipsterProfit = calculateProfit(pick.odds, pick.stake, pick.result);
  const userProfit = calculateProfit(follow.userOdds, follow.userStake, follow.userResult);
  
  // Check if results match
  const resultsMatch = isMatch(pick.result, follow.userResult);
  
  // Profit colors
  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-400';
    if (profit < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      {/* Header: Match + Match/Diverge Indicator */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate" title={pick.match}>
            {pick.match}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">{tipsterName}</p>
        </div>
        {resultsMatch ? (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Match</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Diverge</span>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(follow.dateFollowed)}</span>
      </div>

      {/* Sport */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-300">
          <span className="text-base">{sportIcon}</span>
          <span>{pick.sport}</span>
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-3 pt-2 border-t border-slate-700">
        {/* Cuota Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400 mb-1">Cuota (Tipster)</div>
            <div className="text-lg font-mono font-semibold text-slate-200">
              {pick.odds.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Cuota (Usuario)</div>
            <div className={`text-lg font-mono font-semibold ${
              follow.userOdds === pick.odds ? 'text-slate-200' : 'text-blue-400'
            }`}>
              {follow.userOdds.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Stake Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400 mb-1">Stake (Tipster)</div>
            <div className="text-lg font-mono font-semibold text-slate-200">
              {pick.stake}u
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Stake (Usuario)</div>
            <div className={`text-lg font-mono font-semibold ${
              follow.userStake === pick.stake ? 'text-slate-200' : 'text-blue-400'
            }`}>
              {follow.userStake}u
            </div>
          </div>
        </div>

        {/* Result Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400 mb-1">Resultado (Tipster)</div>
            <Badge variant={getResultVariant(pick.result)} size="sm">
              {pick.result}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Resultado (Usuario)</div>
            <Badge variant={getResultVariant(follow.userResult)} size="sm">
              {follow.userResult}
            </Badge>
          </div>
        </div>

        {/* Profit Comparison */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
          <div>
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Beneficio (Tipster)
            </div>
            <div className={`text-lg font-mono font-semibold ${getProfitColor(tipsterProfit)}`}>
              {tipsterProfit > 0 ? '+' : ''}
              {tipsterProfit.toFixed(2)}u
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Beneficio (Usuario)
            </div>
            <div className={`text-lg font-mono font-semibold ${getProfitColor(userProfit)}`}>
              {userProfit > 0 ? '+' : ''}
              {userProfit.toFixed(2)}u
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          {onEdit && (
            <button
              onClick={() => onEdit(follow)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
              aria-label="Editar follow"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(follow)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              aria-label="Eliminar follow"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Memoized FollowCard to prevent unnecessary re-renders
 */
export const FollowCard = memo(FollowCardComponent);
