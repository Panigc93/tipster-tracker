import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  OddsDistributionChart,
  StakeDistributionChart,
  SportDistributionChart,
  PickTypeDistributionChart,
  PicksTable,
  ConfirmDialog,
} from '@/shared/components';
import { PersonalStatsPanel } from '@/features/dashboard/components';
import { useFollows } from '../../hooks/useFollows';
import { useTipsters } from '@/features/tipsters/hooks/useTipsters';
import { usePicks } from '@/features/picks/hooks/usePicks';
import { useDebounce } from '@shared/hooks';
import { AddFollowModal } from '../../components';
import { SkeletonTable } from '@shared/components/ui';
import type { MyPicksFilters } from './MyPicksPage.types';
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

  // Filters expanded state
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<MyPicksFilters>({
    tipsterId: 'all',
    result: 'all',
    matchStatus: 'all',
    searchQuery: '',
  });
  
  // Debounce search query to optimize performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

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

      // Search filter (match and tipster name)
      if (debouncedSearchQuery) {
        const originalPick = picks.find((p) => p.id === follow.pickId);
        const tipster = tipsters.find((t) => t.id === follow.tipsterId);
        const query = debouncedSearchQuery.toLowerCase();
        const matchText = originalPick?.match?.toLowerCase() || '';
        const tipsterName = tipster?.name?.toLowerCase() || '';

        if (!matchText.includes(query) && !tipsterName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [follows, picks, tipsters, filters, debouncedSearchQuery]);

  // Handlers
  const handleEdit = (follow: UserFollow) => {
    const originalPick = picks.find((p) => p.id === follow.pickId);
    if (!originalPick) {
      toast.error('No se encontró la pick original');
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
      toast.success('Seguimiento eliminado correctamente');
    } catch (error) {
      console.error('Error deleting follow:', error);
      toast.error('Error al eliminar el seguimiento');
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
      <PersonalStatsPanel />


      {/* Charts */}
      {follows.length > 0 && (
        <div className="bg-slate-800 rounded p-3 border border-slate-700 shadow-md">
          <h3 className="text-sm font-semibold text-slate-100 mb-2">
            DISTRIBUCIONES GLOBALES DE TUS FOLLOWS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <OddsDistributionChart follows={follows} height={180} title={follows ? "Tus Cuotas" : undefined} />
            <StakeDistributionChart follows={follows} height={180} title={follows ? "Tus Stakes" : undefined} />
            {picks && (
              <>
                <SportDistributionChart picks={picks} height={140} title={follows ? "Deportes Seguidos" : undefined} />
                <PickTypeDistributionChart picks={picks} height={140} title={follows ? "Tipos de Pick Seguidos" : undefined} />
              </>
            )}
          </div>
        </div>
      )}


      {/* Filters */}
      <div className="bg-slate-800 rounded-md px-3 py-2 border border-slate-700 shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="text-slate-100 hover:text-blue-400 transition-colors"
              aria-label={isFiltersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              {isFiltersExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="text-sm font-semibold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer"
            >
              {isFiltersExpanded ? (<span>OCULTAR FILTROS</span>) : (<span>MOSTRAR FILTROS</span>)}
            </button>
            {hasActiveFilters && (
              <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-blue-500 rounded-full border border-blue-500">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`px-4 py-2 text-sm font-medium text-slate-200 border ${
              hasActiveFilters ? 'border-blue-500 hover:bg-blue-500' : 'border-slate-700 opacity-50 cursor-not-allowed'
            } rounded-md transition-colors`}
          >
            Limpiar Filtros
          </button>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
            {/* Tipster filter */}
            <div>
              <label htmlFor="filter-tipster" className="block text-sm font-medium text-slate-300 mb-2">Tipster</label>
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
                  <option value="all">Todos los tipsters</option>
                  {tipsters.map((tipster) => (
                    <option key={tipster.id} value={tipster.id}>
                      {tipster.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result filter */}
            <div>
              <label htmlFor="filter-result" className="block text-sm font-medium text-slate-300 mb-2">Resultado</label>
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
                  <option value="all">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="Ganada">Ganada</option>
                  <option value="Perdida">Perdida</option>
                  <option value="Void">Void</option>
                </select>
              </div>
            </div>

            {/* Match/Diverge filter */}
            <div>
              <label htmlFor="filter-match" className="block text-sm font-medium text-slate-300 mb-2">Match/Diverge</label>
              <div className="relative">
                <select
                  id="filter-match"
                  value={filters.matchStatus}
                  onChange={(e) => handleFilterChange('matchStatus', e.target.value)}
                  className="w-full h-[35px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="match">Match</option>
                  <option value="diverge">Diverge</option>
                </select>
              </div>
            </div>

            {/* Search filter */}
            <div>
              <label htmlFor="filter-search" className="block text-sm font-medium text-slate-300 mb-2">Búsqueda</label>
              <input
                id="filter-search"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Partido o tipster..."
                className="w-full h-[35px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div>
        {(() => {
          if (loading) {
            return <SkeletonTable rows={8} columns={10} />;
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
            <PicksTable
              mode="follows"
              data={filteredFollows}
              picks={picks}
              getTipsterName={(tipsterId) => {
                const tipster = tipsters.find((t) => t.id === tipsterId);
                return tipster?.name || 'Desconocido';
              }}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No hay follows disponibles"
            />
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
          tipsterName={tipsters.find(t => t.id === selectedPick.tipsterId)?.name}
          follow={selectedFollow}
          onUpdate={updateFollow}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFollow(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Follow"
        message="¿Estás seguro de que quieres eliminar este seguimiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous
      />
    </div>
  );
};
