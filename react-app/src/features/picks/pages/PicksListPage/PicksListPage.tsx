/**
 * @fileoverview PicksListPage - Main picks management page
 * @module features/picks/pages/PicksListPage
 */

import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@shared/components/ui';
import { PickTableRow, AddPickModal } from '../../components';
import { usePicks } from '../../hooks';
import { useTipsters } from '@features/tipsters/hooks';
import { useFollows } from '@features/follows/hooks';
import { AddFollowModal } from '@features/follows/components';
import { Sport, PickResult } from '@shared/types/enums';
import type { Pick } from '@shared/types';
import type { PickFilters } from './PicksListPage.types';
import { getSportIcon } from '../../utils/sport-icons';

/**
 * Filter picks based on current filter state
 */
const filterPicks = (picks: Pick[], filters: PickFilters): Pick[] => {
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

    // Search query (match and betType)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
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

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [editingPick, setEditingPick] = useState<Pick | undefined>(undefined);
  const [followingPick, setFollowingPick] = useState<Pick | undefined>(undefined);

  // Filter state
  const [filters, setFilters] = useState<PickFilters>({
    // Basic filters
    tipsterId: '',
    sport: '',
    result: '',
    bookmaker: '',
    searchQuery: '',
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
    () => filterPicks(picks, filters),
    [picks, filters]
  );

  // Stats
  const stats = useMemo(() => {
    const total = filteredPicks.length;
    const resolved = filteredPicks.filter((p) => p.isResolved).length;
    const pending = total - resolved;
    const won = filteredPicks.filter((p) => p.result === 'Ganada').length;
    const winrate = resolved > 0 ? ((won / resolved) * 100).toFixed(1) : '0.0';

    return { total, resolved, pending, won, winrate };
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
    filters.searchQuery ||
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
      searchQuery: '',
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

  const handleDelete = async (pick: Pick) => {
    if (globalThis.confirm('¿Estás seguro de eliminar esta pick?')) {
      await deletePick(pick.id);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
          <h1 className="text-3xl font-bold text-slate-100">Todas las Picks</h1>
          <p className="text-slate-400 mt-1">
            Gestiona y analiza todas las picks de tus tipsters
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir Pick
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Picks</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Resueltas</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Ganadas</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.won}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Winrate</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{stats.winrate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Filtros</h2>
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search-picks" className="block text-sm font-medium text-slate-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-picks"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Buscar por partido o tipo de apuesta..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="filter-date-from" className="block text-sm font-medium text-slate-300 mb-2">
              Fecha desde
            </label>
            <input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="filter-date-to" className="block text-sm font-medium text-slate-300 mb-2">
              Fecha hasta
            </label>
            <input
              id="filter-date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tipster */}
          <div>
            <label htmlFor="filter-tipster" className="block text-sm font-medium text-slate-300 mb-2">
              Tipster
            </label>
            <select
              id="filter-tipster"
              value={filters.tipsterId}
              onChange={(e) => handleFilterChange('tipsterId', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {tipsters.map((tipster) => (
                <option key={tipster.id} value={tipster.id}>
                  {tipster.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sport */}
          <div>
            <label htmlFor="filter-sport" className="block text-sm font-medium text-slate-300 mb-2">
              Deporte
            </label>
            <select
              id="filter-sport"
              value={filters.sport}
              onChange={(e) => handleFilterChange('sport', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {Object.values(Sport).map((sport) => (
                <option key={sport} value={sport}>
                  {getSportIcon(sport)} {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div>
            <label htmlFor="filter-result" className="block text-sm font-medium text-slate-300 mb-2">
              Resultado
            </label>
            <select
              id="filter-result"
              value={filters.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Picks Table */}
      {filteredPicks.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              {hasActiveFilters ? 'No hay picks con estos filtros' : 'No hay picks registradas'}
            </h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? 'Prueba a cambiar los filtros de búsqueda'
                : 'Comienza añadiendo tu primera pick'}
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
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-500/10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tipster
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Partido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Deporte
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Apuesta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Cuota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Stake
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Bookmaker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPicks.map((pick) => (
                  <PickTableRow
                    key={pick.id}
                    pick={pick}
                    tipsterName={getTipsterName(pick.tipsterId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onFollow={handleFollow}
                    isFollowed={isPickFollowed(pick.id)}
                    showActions
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50">
            <p className="text-sm text-slate-400">
              Mostrando <span className="font-semibold text-slate-300">{filteredPicks.length}</span>{' '}
              {filteredPicks.length === 1 ? 'pick' : 'picks'}
              {hasActiveFilters && (
                <span>
                  {' '}
                  de <span className="font-semibold text-slate-300">{picks.length}</span> totales
                </span>
              )}
            </p>
          </div>
        </div>
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
          onSuccess={() => {
            setIsFollowModalOpen(false);
            setFollowingPick(undefined);
          }}
        />
      )}
    </div>
  );
}
