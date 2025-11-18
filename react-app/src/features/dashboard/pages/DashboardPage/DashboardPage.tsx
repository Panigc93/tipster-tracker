/**
 * DashboardPage
 * Main dashboard view with personal stats, filters, and tipster grid
 */

import { PersonalStatsPanel, DashboardFilters, TipsterCard } from '../../components';
import { useDashboardFilters } from '../../hooks';

export function DashboardPage() {
  const {
    tipsters: filteredTipsters,
    filters,
    activeFiltersCount,
    isLoading,
    setSports,
    setChannels,
    setYieldMin,
    setLastPickDays,
    setSortBy,
    setSearchQuery,
    resetFilters,
  } = useDashboardFilters();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Gestiona y analiza el rendimiento de tus tipsters
          </p>
        </div>

        {/* Personal stats */}
        <PersonalStatsPanel />

        {/* Filters */}
        <DashboardFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          onSportsChange={setSports}
          onChannelsChange={setChannels}
          onYieldMinChange={setYieldMin}
          onLastPickDaysChange={setLastPickDays}
          onSortByChange={setSortBy}
          onSearchQueryChange={setSearchQuery}
          onResetFilters={resetFilters}
        />

        {/* Tipsters grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Cargando tipsters...</div>
          </div>
        )}

        {!isLoading && filteredTipsters.length === 0 && (
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              No se encontraron tipsters
            </h3>
            <p className="text-slate-400 mb-4">
              {activeFiltersCount > 0
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Comienza añadiendo tu primer tipster'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!isLoading && filteredTipsters.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400">
                Mostrando {filteredTipsters.length} tipster{filteredTipsters.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTipsters.map((tipster) => (
                <TipsterCard key={tipster.id} tipster={tipster} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
