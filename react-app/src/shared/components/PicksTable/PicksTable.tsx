/**
 * @fileoverview PicksTable - Unified table component for picks and follows
 * @module shared/components/PicksTable
 */

import { useMemo } from 'react';
import { PickCard } from '@/features/picks/components';
import { FollowCard } from '@/features/follows/components';
import { useSortableTable } from '@/shared/hooks';
import type { Pick, UserFollow } from '@/shared/types';
import type { PicksTableProps, PicksTableColumns, EnrichedFollow } from './PicksTable.types';
import { PicksTableHeader } from './PicksTableHeader';
import { PicksTableRow } from './PicksTableRow';

/**
 * Get default columns based on mode
 */
const getDefaultColumns = (mode: 'picks' | 'follows'): PicksTableColumns => {
  if (mode === 'picks') {
    return {
      date: true,
      tipster: true,
      match: true,
      sport: true,
      pickType: true,
      betType: true,
      odds: true,
      stake: true,
      bookmaker: true,
      result: true,
      profit: true,
      matchComparison: false,
      actions: true,
    };
  }
  
  // follows mode
  return {
    date: true,
    tipster: true,
    match: true,
    sport: true,
    pickType: false,
    betType: true, // Show bet type for follows
    odds: true,
    stake: true,
    bookmaker: false,
    result: true,
    profit: true,
    matchComparison: false, // Removed - redundant, users can see by comparing result badges
    actions: true,
  };
};

/**
 * PicksTable Component
 * Unified table for displaying picks or follows with sorting and responsive design
 */
export function PicksTable({
   
  mode,
  data,
  picks,
  columns: customColumns,
  defaultSortKey = mode === 'picks' ? 'date' : 'dateTimeFollowed',
  defaultSortDirection = 'desc',
  onEdit,
  onDelete,
  onFollow,
  isFollowed,
  getTipsterName,
  title,
  showActions = true,
  emptyMessage,
}: PicksTableProps) {
  // Merge default columns with custom columns
  const columns = useMemo(() => {
    const defaults = getDefaultColumns(mode);
    return { ...defaults, ...customColumns };
  }, [mode, customColumns]);

  // Enrich follows with sport field from original pick (needed for sorting)
  const enrichedData = useMemo(() => {
    if (mode === 'follows') {
      const follows = data as UserFollow[];
      return follows.map(follow => {
        const originalPick = picks?.find(p => p.id === follow.pickId);
        return {
          ...follow,
          sport: originalPick?.sport || '',
        } as EnrichedFollow;
      });
    }
    return data;
  }, [mode, data, picks]);

  // Sorting - Type the result based on mode
  const { 
    sortedData: rawSortedData, 
    requestSort, 
    getSortIndicator 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useSortableTable(enrichedData as unknown as any[], defaultSortKey, defaultSortDirection);

  // Cast sortedData to the correct type based on mode
  const sortedData = (mode === 'picks' 
    ? rawSortedData as unknown as Pick[] 
    : rawSortedData as unknown as (UserFollow & { sport?: string })[]) as (Pick | (UserFollow & { sport?: string }))[];

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-sm text-slate-400">
          {emptyMessage || 'No hay datos disponibles'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          {title} ({data.length})
        </h2>
      )}
      
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-4">
        {sortedData.map((item) => {
          if (mode === 'picks') {
            const pick = item as unknown as Pick;
            return (
              <PickCard
                key={pick.id}
                pick={pick}
                tipsterName={getTipsterName(pick.tipsterId)}
                showActions={showActions}
                onEdit={onEdit ? () => onEdit(pick) : undefined}
                onDelete={onDelete ? () => onDelete(pick) : undefined}
                onFollow={onFollow ? () => onFollow(pick) : undefined}
                isFollowed={isFollowed ? isFollowed(pick.id) : false}
              />
            );
          } else {
            const follow = item as unknown as UserFollow;
            const originalPick = picks?.find(p => p.id === follow.pickId);
            if (!originalPick) return null;

            return (
              <FollowCard
                key={follow.id}
                follow={follow}
                pick={originalPick}
                tipsterName={getTipsterName(follow.tipsterId)}
                onEdit={onEdit ? () => onEdit(follow) : undefined}
                onDelete={onDelete ? () => onDelete(follow) : undefined}
              />
            );
          }
        })}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <PicksTableHeader
              mode={mode}
              columns={columns}
              requestSort={requestSort}
              getSortIndicator={getSortIndicator}
            />
            <tbody className="divide-y divide-slate-800">
              {sortedData.map((item) => (
                <PicksTableRow
                  key={mode === 'picks' ? (item as unknown as Pick).id : (item as unknown as UserFollow).id}
                  mode={mode}
                  item={item}
                  picks={picks}
                  getTipsterName={getTipsterName}
                  showActions={showActions}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onFollow={onFollow}
                  isFollowed={isFollowed}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
