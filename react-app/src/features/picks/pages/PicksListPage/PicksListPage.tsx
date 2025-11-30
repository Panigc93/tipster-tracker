/**
 * @fileoverview PicksListPage - Main picks management page
 * @module features/picks/pages/PicksListPage
 */

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, SkeletonText, SkeletonCard, SkeletonTable } from '@shared/components/ui';
import { ConfirmDialog, PicksTable, StatCard } from '@shared/components';
import { AddPickModal } from '../../components';
import { usePicks } from '../../hooks';
import { useTipsters } from '@features/tipsters/hooks';
import { useFollows } from '@features/follows/hooks';
import { AddFollowModal } from '@features/follows/components';
import { PickResult } from '@shared/types/enums';
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown } from '@features/settings/components';
import type { Pick } from '@shared/types';
import type { PickFilters } from './PicksListPage.types';

/**
 * Filter picks based on current filter state
 */
const filterPicks = (picks: Pick[], filters: PickFilters, debouncedSearchQuery: string): Pick[] => {
  return picks.filter((pick) => {
    // Basic filters (single select - backward compatibility)
    if (filters.tipsterId && pick.tipsterId !== filters.tipsterId) {
      return false;
    }

    if (filters.sport && pick.sport !== filters.sport) {
      return false;
    }

    if (filters.result && pick.result !== filters.result) {
      return false;
    }

    if (filters.bookmaker && pick.bookmaker !== filters.bookmaker) {
      return false;
    }

    // Advanced filters (multi-select)
    if (filters.tipsterIds.length > 0 && !filters.tipsterIds.includes(pick.tipsterId)) {
      return false;
    }

    if (filters.sports.length > 0 && !filters.sports.includes(pick.sport)) {
      return false;
    }

    if (filters.bookmakers.length > 0 && !filters.bookmakers.includes(pick.bookmaker)) {
      return false;
    }

    // Pick type filter
    if (filters.pickType && pick.pickType !== filters.pickType) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && pick.date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && pick.date > filters.dateTo) {
      return false;
    }

    // Odds range filter
    if (filters.oddsMin !== null && pick.odds < filters.oddsMin) {
      return false;
    }

    if (filters.oddsMax !== null && pick.odds > filters.oddsMax) {
      return false;
    }

    // Stake range filter
    if (filters.stakeMin !== null && pick.stake < filters.stakeMin) {
      return false;
    }

    if (filters.stakeMax !== null && pick.stake > filters.stakeMax) {
      return false;
    }

    // Search query (match and betType) - using debounced value
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      const matchLower = pick.match.toLowerCase();
      const betTypeLower = pick.betType.toLowerCase();
      
      if (!matchLower.includes(query) && !betTypeLower.includes(query)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * PicksListPage component
 * Main page for viewing and managing all picks
 */
export function PicksListPage() {
  const { picks, loading, error, deletePick, updatePick } = usePicks();
  const { tipsters, loading: tipstersLoading } = useTipsters();
  const { isPickFollowed } = useFollows();
  const { settings } = useSettings();

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followingPick, setFollowingPick] = useState<Pick | undefined>(undefined);
  const [editingPick, setEditingPick] = useState<Pick | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pickToDelete, setPickToDelete] = useState<Pick | null>(null);

  // Filters expanded state
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<PickFilters>({
    // Basic filters
    tipsterId: '',
    sport: '',
    result: '',
    bookmaker: '',
    // Advanced filters
    tipsterIds: [],
    sports: [],
    bookmakers: [],
    pickType: '',
    dateFrom: '',
    dateTo: '',
    oddsMin: null,
    oddsMax: null,
    stakeMin: null,
    stakeMax: null,
  });
  
  // Filtered picks
  const filteredPicks = useMemo(
    () => filterPicks(picks, filters, ''),
    [picks, filters]
  );

  // Comprehensive Stats (matching Dashboard)
  const stats = useMemo(() => {
    const total = filteredPicks.length;
    const resolved = filteredPicks.filter((p) => p.isResolved);
    const resolvedCount = resolved.length;
    
    // Winrate
    const won = resolved.filter((p) => p.result === 'Ganada').length;
    const winrate = resolvedCount > 0 ? (won / resolvedCount) * 100 : 0;
    
    // Yield and Profit
    const totalStaked = resolved.reduce((sum, p) => {
      if (p.result === 'Void') return sum;
      return sum + p.stake;
    }, 0);
    
    const totalProfit = resolved.reduce((sum, p) => {
      if (p.result === 'Ganada') {
        return sum + (p.odds - 1) * p.stake;
      } else if (p.result === 'Perdida') {
        return sum - p.stake;
      }
      return sum; // Void
    }, 0);
    
    const yieldValue = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    
    // Average odds and stake
    const avgOdds = resolvedCount > 0
      ? resolved.reduce((sum, p) => sum + p.odds, 0) / resolvedCount
      : 0;
    
    const avgStake = resolvedCount > 0
      ? resolved.reduce((sum, p) => sum + p.stake, 0) / resolvedCount
      : 0;

    return {
      total,
      winrate: Math.round(winrate * 100) / 100,
      yieldValue: Math.round(yieldValue * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      avgOdds: Math.round(avgOdds * 100) / 100,
      avgStake: Math.round(avgStake * 100) / 100,
    };
  }, [filteredPicks]);

  // Get tipster name by ID
  const getTipsterName = (tipsterId: string): string => {
    const tipster = tipsters.find((t) => t.id === tipsterId);
    return tipster?.name || 'Desconocido';
  };

  // Detect active filters
  const hasActiveFilters =
    filters.tipsterId ||
    filters.sport ||
    filters.result ||
    filters.bookmaker ||
    filters.dateFrom ||
    filters.dateTo;

  // Handlers
  const handleFilterChange = (key: keyof PickFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      // Basic filters
      tipsterId: '',
      sport: '',
      result: '',
      bookmaker: '',
      // Advanced filters
      tipsterIds: [],
      sports: [],
      bookmakers: [],
      pickType: '',
      dateFrom: '',
      dateTo: '',
      oddsMin: null,
      oddsMax: null,
      stakeMin: null,
      stakeMax: null,
    });
  };

  const handleEdit = (pick: Pick) => {
    setEditingPick(pick);
    setIsEditModalOpen(true);
  };

  const handleDelete = (pick: Pick) => {
    setPickToDelete(pick);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pickToDelete) return;

    try {
      await deletePick(pickToDelete.id);
      toast.success('Pick eliminada correctamente');
    } catch {
      toast.error('Error al eliminar la pick');
    } finally {
      setIsDeleteConfirmOpen(false);
      setPickToDelete(null);
    }
  };


  const handleFollow = (pick: Pick) => {
    setFollowingPick(pick);
    setIsFollowModalOpen(true);
  };

  const handleAddSuccess = () => {
    // Refresh is automatic via listener
  };

  const handleUpdateSuccess = () => {
    // Refresh is automatic via listener
  };

  const handleUpdatePick = async (pickId: string, data: Record<string, unknown>) => {
    await updatePick(pickId, data);
  };

  // Loading state
  if (loading || tipstersLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonText width="250px" height="32px" />
            <SkeletonText width="350px" height="16px" />
          </div>
          <SkeletonText width="120px" height="40px" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} height="100px" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <SkeletonCard height="180px" />

        {/* Table Skeleton */}
        <SkeletonTable rows={10} columns={12} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => globalThis.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tipsters Picks</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Gestiona y analiza todas los picks de tus tipsters
          </p>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="bg-slate-800 rounded p-3 border border-slate-700 shadow-md">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">ESTADÍSTICAS GLOBALES DE TUS TIPSTERS</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard 
            label="Total Picks" 
            value={stats.total}
          />
          <StatCard 
            label="Winrate" 
            value={`${stats.winrate.toFixed(2)}%`}
          />
          <StatCard 
            label="Yield" 
            value={`${stats.yieldValue.toFixed(2)}%`}
            valueClassName={stats.yieldValue >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatCard 
            label="Beneficio Total" 
            value={`${stats.totalProfit.toFixed(2)}u`}
            valueClassName={stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatCard 
            label="Cuota Media" 
            value={stats.avgOdds.toFixed(2)}
          />
          <StatCard 
            label="Stake Medio" 
            value={stats.avgStake.toFixed(2)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-md px-3 py-2 border border-slate-700 shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="text-slate-100 hover:text-blue-400 transition-colors"
              aria-label={isFiltersExpanded ? 'Colapsar filtros' : 'Expandir filtros'}
            >
              {isFiltersExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="text-sm  font-semibold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer"
            >
            {isFiltersExpanded ? (<span>OCULTAR FILTROS</span>) : (<span>MOSTRAR FILTROS</span>)}
            </button>
            {hasActiveFilters && (
              <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-blue-500 rounded-full border border-blue-500">
                {[
                  filters.tipsterId,
                  filters.sport,
                  filters.result,
                  filters.bookmaker,
                  filters.dateFrom,
                  filters.dateTo
                ].filter(Boolean).length}
              </span>
            )}
          </div>
          <button
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className={`px-4 py-2 text-sm font-medium text-slate-200 border ${
              hasActiveFilters ? 'border-blue-500 hover:bg-blue-500' : 'border-slate-700 opacity-50 cursor-not-allowed'
            } rounded-md transition-colors`}
          >
            Limpiar Filtros
          </button>
        </div>

        {isFiltersExpanded && (
          <div className="text-base grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
            {/* Date From */}
            <div>
              <label htmlFor="filter-date-from" className="block text-sm font-medium text-slate-300 mb-2">
                Fecha desde
              </label>
              <div className="relative">
                <input
                  id="filter-date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full h-[35px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {filters.dateFrom && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Limpiar fecha desde"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Date To */}
            <div>
              <label htmlFor="filter-date-to" className="block text-sm font-medium text-slate-300 mb-2">
                Fecha hasta
              </label>
              <div className="relative">
                <input
                  id="filter-date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full h-[35px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {filters.dateTo && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Limpiar fecha hasta"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Tipster */}
            <div>
              <label htmlFor="filter-tipster" className="block text-sm font-medium text-slate-300 mb-2">
                Tipster
              </label>
              <div className="relative">
                <select
                  id="filter-tipster"
                  value={filters.tipsterId}
                  onChange={(e) => handleFilterChange('tipsterId', e.target.value)}
                  className="w-full h-[35px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <option value="">Todos</option>
                  {tipsters.map((tipster) => (
                    <option key={tipster.id} value={tipster.id}>
                      {tipster.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sport */}
            <div>
              <ManageableDropdown
                label="Deporte"
                value={filters.sport}
                items={settings?.sports || []}
                category="sport"
                onChange={(value) => handleFilterChange('sport', value)}
                placeholder="Todos"
              />
            </div>

            {/* Result */}
            <div>
              <label htmlFor="filter-result" className="block text-sm font-medium text-slate-300 mb-2">
                Resultado
              </label>
              <div className="relative">
                <select
                  id="filter-result"
                  value={filters.result}
                  onChange={(e) => handleFilterChange('result', e.target.value)}
                  className="w-full h-[35px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <option value="">Todos</option>
                  {Object.values(PickResult).map((result) => (
                    <option key={result} value={result}>
                      {result}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bookmaker */}
            <div>
              <ManageableDropdown
                label="Casa de Apuestas"
                value={filters.bookmaker}
                items={settings?.bookmakers || []}
                category="bookmaker"
                onChange={(value) => handleFilterChange('bookmaker', value)}
                placeholder="Todas"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Indicator */}
      {hasActiveFilters && (
        <div className="text-sm text-slate-400 mb-4">
          <span className="font-medium text-slate-300">{filteredPicks.length}</span>
          {' '}{filteredPicks.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </div>
      )}

      {/* Picks Table */}
      {filteredPicks.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              {hasActiveFilters ? 'No hay picks con estos filtros' : 'No hay picks registrados'}
            </h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? 'Prueba a cambiar los filtros de búsqueda'
                : 'Comienza añadiendo tu primer pick'}
            </p>
            {hasActiveFilters ? (
              <Button variant="secondary" onClick={handleResetFilters}>
                Limpiar filtros
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Pick
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>

          <PicksTable
            mode="picks"
            data={filteredPicks}
            getTipsterName={getTipsterName}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFollow={handleFollow}
            isFollowed={isPickFollowed}
            emptyMessage="No hay picks disponibles"
          />
        </>
      )}

      {/* Modals */}
      <AddPickModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        tipsters={tipsters}
      />

      <AddPickModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPick(undefined);
        }}
        onSuccess={handleUpdateSuccess}
        tipsters={tipsters}
        pick={editingPick}
        onUpdate={handleUpdatePick}
      />

      {followingPick && (
        <AddFollowModal
          isOpen={isFollowModalOpen}
          onClose={() => {
            setIsFollowModalOpen(false);
            setFollowingPick(undefined);
          }}
          pick={followingPick}
          tipsterName={getTipsterName(followingPick.tipsterId)}
          onSuccess={() => {
            setIsFollowModalOpen(false);
            setFollowingPick(undefined);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPickToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Pick?"
        message="¿Estás seguro de que quieres eliminar esta pick?\n\nEsta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDangerous
      />
    </div>
  );
}
