import { useState, useMemo } from 'react';
import { Trash2, Filter, X, TrendingUp, Target, Percent, DollarSign } from 'lucide-react';
import {
  OddsDistributionChart,
  StakeDistributionChart,
} from '@/shared/components';
import { useFollows } from '../../hooks/useFollows';
import { useTipsters } from '@/features/tipsters/hooks/useTipsters';
import { usePicks } from '@/features/picks/hooks/usePicks';
import { useSortableTable } from '@shared/hooks';
import { FollowTableRow } from '../../components/FollowTableRow';
import { AddFollowModal } from '../../components/AddFollowModal';
import type { MyPicksFilters, FollowStats } from './MyPicksPage.types';
import type { UserFollow, Pick } from '@/shared/types';

export const MyPicksPage = () => {
  // Hooks
  const { follows, loading, deleteFollow, updateFollow } = useFollows();
  const { tipsters } = useTipsters();
  const { picks } = usePicks();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFollow, setSelectedFollow] = useState<UserFollow | null>(null);
  const [selectedPick, setSelectedPick] = useState<Pick | null>(null);

  // Filter states
  const [filters, setFilters] = useState<MyPicksFilters>({
    tipsterId: 'all',
    result: 'all',
    matchStatus: 'all',
    searchQuery: '',
  });

  // Calculate stats
  const stats = useMemo<FollowStats>(() => {
    console.log('🔍 Calculating stats for follows:', follows);
    console.log('📊 Total follows:', follows.length);
    
    const resolvedFollows = follows.filter((f) => f.isResolved);
    console.log('✅ Resolved follows:', resolvedFollows.length, resolvedFollows);
    
    const wonFollows = resolvedFollows.filter((f) => f.userResult === 'Ganada');
    const lostFollows = resolvedFollows.filter((f) => f.userResult === 'Perdida');
    const voidFollows = resolvedFollows.filter((f) => f.userResult === 'Void');
    
    console.log('📈 Won:', wonFollows.length, 'Lost:', lostFollows.length, 'Void:', voidFollows.length);

    const totalStaked = resolvedFollows.reduce((sum, f) => {
      if (f.userResult === 'Void') return sum;
      return sum + f.userStake;
    }, 0);

    const profit = resolvedFollows.reduce((sum, f) => sum + (f.profitFromFollow || 0), 0);

    const yieldValue = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
    const winrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length) * 100 : 0;

    const avgOdds =
      resolvedFollows.length > 0
        ? resolvedFollows.reduce((sum, f) => sum + f.userOdds, 0) / resolvedFollows.length
        : 0;

    const avgStake =
      resolvedFollows.length > 0
        ? resolvedFollows.reduce((sum, f) => sum + f.userStake, 0) / resolvedFollows.length
        : 0;

    // Calculate match/diverge
    let matchCount = 0;
    let divergeCount = 0;

    for (const follow of follows) {
      if (!follow.isResolved) continue;

      const originalPick = picks.find((p) => p.id === follow.pickId);
      if (!originalPick?.isResolved) continue;

      if (follow.userResult === originalPick.result) {
        matchCount++;
      } else {
        divergeCount++;
      }
    }

    const matchRate = resolvedFollows.length > 0 ? (matchCount / resolvedFollows.length) * 100 : 0;

    return {
      totalFollows: follows.length,
      resolvedFollows: resolvedFollows.length,
      pendingFollows: follows.length - resolvedFollows.length,
      wonFollows: wonFollows.length,
      lostFollows: lostFollows.length,
      voidFollows: voidFollows.length,
      winrate,
      yield: yieldValue,
      profit,
      totalStaked,
      avgOdds,
      avgStake,
      matchCount,
      divergeCount,
      matchRate,
    };
  }, [follows, picks]);

  // Filter follows
  const filteredFollows = useMemo(() => {
    return follows.filter((follow) => {
      // Filter by tipster
      if (filters.tipsterId !== 'all' && follow.tipsterId !== filters.tipsterId) {
        return false;
      }

      // Filter by result
      if (filters.result !== 'all') {
        if (filters.result === 'pending' && follow.isResolved) return false;
        if (filters.result !== 'pending' && follow.userResult !== filters.result) return false;
      }

      // Filter by match status
      if (filters.matchStatus !== 'all') {
        const originalPick = picks.find((p) => p.id === follow.pickId);
        // Solo requiere que el follow esté resuelto y que exista el pick original
        if (!originalPick || !follow.isResolved) return false;

        const isMatch = follow.userResult === originalPick.result;
        if (filters.matchStatus === 'match' && !isMatch) return false;
        if (filters.matchStatus === 'diverge' && isMatch) return false;
      }

      // Filter by search query (match or tipster name)
      if (filters.searchQuery) {
        const originalPick = picks.find((p) => p.id === follow.pickId);
        const tipster = tipsters.find((t) => t.id === follow.tipsterId);
        const query = filters.searchQuery.toLowerCase();
        const matchText = originalPick?.match?.toLowerCase() || '';
        const tipsterName = tipster?.name?.toLowerCase() || '';

        if (!matchText.includes(query) && !tipsterName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [follows, picks, tipsters, filters]);

  // Sorting (default: sort by dateTimeFollowed descending - most recent first)
  const { sortedData: sortedFollows, requestSort, getSortIndicator } = useSortableTable<UserFollow>(
    filteredFollows,
    'dateTimeFollowed',
    'desc'
  );

  // Handlers
  const handleEdit = (follow: UserFollow) => {
    const originalPick = picks.find((p) => p.id === follow.pickId);
    if (!originalPick) {
      alert('No se encontró la pick original');
      return;
    }

    setSelectedFollow(follow);
    setSelectedPick(originalPick);
    setIsEditModalOpen(true);
  };

  const handleDelete = (follow: UserFollow) => {
    setSelectedFollow(follow);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFollow) return;

    try {
      await deleteFollow(selectedFollow.id);
      setIsDeleteModalOpen(false);
      setSelectedFollow(null);
    } catch (error) {
      console.error('Error deleting follow:', error);
      alert('Error al eliminar el seguimiento');
    }
  };

  const handleFilterChange = (key: keyof MyPicksFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tipsterId: 'all',
      result: 'all',
      matchStatus: 'all',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.tipsterId !== 'all' ||
    filters.result !== 'all' ||
    filters.matchStatus !== 'all' ||
    filters.searchQuery !== '';

  const activeFilterCount = [
    filters.tipsterId !== 'all',
    filters.result !== 'all',
    filters.matchStatus !== 'all',
    filters.searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Picks</h1>
          <p className="mt-1 text-sm text-gray-400">
            Seguimiento de tus apuestas comparadas con los tipsters
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Follows</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.totalFollows}</p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.pendingFollows} pendientes
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Winrate</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.winrate.toFixed(1)}%</p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.wonFollows}G · {stats.lostFollows}P · {stats.voidFollows}V
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Yield</p>
              <p
                className={`mt-2 text-3xl font-semibold ${
                  stats.yield >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stats.yield >= 0 ? '+' : ''}
                {stats.yield.toFixed(2)}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Profit: {stats.profit >= 0 ? '+' : ''}
                {stats.profit.toFixed(2)}u
              </p>
            </div>
            <Percent className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Match Rate</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.matchRate.toFixed(1)}%</p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.matchCount} match · {stats.divergeCount} diverge
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      {follows.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            Distribuciones Globales de tus Follows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OddsDistributionChart follows={follows} height={180} title="Tus Cuotas" />
            <StakeDistributionChart follows={follows} height={180} title="Tus Stakes" />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg bg-slate-800 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                {activeFilterCount} {activeFilterCount === 1 ? 'filtro activo' : 'filtros activos'}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tipster filter */}
          <div>
            <label htmlFor="filter-tipster" className="mb-1 block text-sm font-medium text-gray-300">Tipster</label>
            <select
              id="filter-tipster"
              value={filters.tipsterId}
              onChange={(e) => handleFilterChange('tipsterId', e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos los tipsters</option>
              {tipsters.map((tipster) => (
                <option key={tipster.id} value={tipster.id}>
                  {tipster.name}
                </option>
              ))}
            </select>
          </div>

          {/* Result filter */}
          <div>
            <label htmlFor="filter-result" className="mb-1 block text-sm font-medium text-gray-300">Resultado</label>
            <select
              id="filter-result"
              value={filters.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="Ganada">Ganada</option>
              <option value="Perdida">Perdida</option>
              <option value="Void">Void</option>
            </select>
          </div>

          {/* Match/Diverge filter */}
          <div>
            <label htmlFor="filter-match" className="mb-1 block text-sm font-medium text-gray-300">Match/Diverge</label>
            <select
              id="filter-match"
              value={filters.matchStatus}
              onChange={(e) => handleFilterChange('matchStatus', e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="match">Match</option>
              <option value="diverge">Diverge</option>
            </select>
          </div>

          {/* Search filter */}
          <div>
            <label htmlFor="filter-search" className="mb-1 block text-sm font-medium text-gray-300">Búsqueda</label>
            <input
              id="filter-search"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              placeholder="Partido o tipster..."
              className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-slate-800 p-4">
        {(() => {
          if (loading) {
            return (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-400">Cargando follows...</p>
              </div>
            );
          }

          if (filteredFollows.length === 0) {
            return (
              <div className="py-12 text-center">
                <p className="text-gray-400">
                  {hasActiveFilters ? 'No se encontraron follows con estos filtros' : 'No has seguido ninguna pick todavía'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            );
          }

          return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                    onClick={(e) => requestSort('dateTimeFollowed', e.shiftKey)}
                    title="Click para ordenar por fecha (Shift+Click para multi-sort)"
                  >
                    <span className="flex items-center gap-1">
                      Fecha {getSortIndicator('dateTimeFollowed')}
                    </span>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                    onClick={(e) => requestSort('tipsterId', e.shiftKey)}
                    title="Click para ordenar por tipster (Shift+Click para multi-sort)"
                  >
                    <span className="flex items-center gap-1">
                      Tipster {getSortIndicator('tipsterId')}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Match
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                    onClick={(e) => requestSort('sport', e.shiftKey)}
                    title="Click para ordenar por deporte (Shift+Click para multi-sort)"
                  >
                    <span className="flex items-center gap-1">
                      Deporte {getSortIndicator('sport')}
                    </span>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                    onClick={(e) => requestSort('userOdds', e.shiftKey)}
                    title="Click para ordenar por cuota (Shift+Click para multi-sort)"
                  >
                    <span className="flex items-center gap-1">
                      Cuota {getSortIndicator('userOdds')}
                    </span>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                    onClick={(e) => requestSort('userStake', e.shiftKey)}
                    title="Click para ordenar por stake (Shift+Click para multi-sort)"
                  >
                    <span className="flex items-center gap-1">
                      Stake {getSortIndicator('userStake')}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Resultado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Profit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Match
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400 w-40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {sortedFollows.map((follow) => {
                  const originalPick = picks.find((p) => p.id === follow.pickId);
                  if (!originalPick) return null;

                  const tipster = tipsters.find((t) => t.id === follow.tipsterId);
                  const tipsterName = tipster?.name || 'Desconocido';

                  return (
                    <FollowTableRow
                      key={follow.id}
                      follow={follow}
                      pick={originalPick}
                      tipsterName={tipsterName}
                      onEdit={() => handleEdit(follow)}
                      onDelete={() => handleDelete(follow)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          );
        })()}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedFollow && selectedPick && (
        <AddFollowModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFollow(null);
            setSelectedPick(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedFollow(null);
            setSelectedPick(null);
          }}
          pick={selectedPick}
          follow={selectedFollow}
          onUpdate={updateFollow}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedFollow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-slate-800 p-6">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Eliminar Follow</h3>
                <p className="mt-1 text-sm text-gray-400">
                  ¿Estás seguro de que quieres eliminar este seguimiento? Esta acción no se puede
                  deshacer.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedFollow(null);
                }}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
