/**
 * DashboardFilters component
 * Comprehensive filtering UI for dashboard tipsters
 */

import { Search, X } from 'lucide-react';
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown } from '@features/settings/components';
import type { DashboardFiltersState } from '../../utils/dashboard-filters.utils';

interface DashboardFiltersProps {
  readonly filters: DashboardFiltersState;
  readonly activeFiltersCount: number;
  readonly onSportsChange: (sports: string[]) => void;
  readonly onChannelsChange: (channels: string[]) => void;
  readonly onYieldMinChange: (yieldMin: number) => void;
  readonly onLastPickDaysChange: (days: DashboardFiltersState['lastPickDays']) => void;
  readonly onSortByChange: (sortBy: DashboardFiltersState['sortBy']) => void;
  readonly onSearchQueryChange: (query: string) => void;
  readonly onResetFilters: () => void;
}

export function DashboardFilters({
  filters,
  activeFiltersCount,
  onSportsChange,
  onChannelsChange,
  onYieldMinChange,
  onLastPickDaysChange,
  onSortByChange,
  onSearchQueryChange,
  onResetFilters,
}: Readonly<DashboardFiltersProps>) {
  const { settings } = useSettings();

  return (
    <div className="bg-slate-800 rounded-md p-3 border border-slate-700 shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="inline-flex items-center gap-2">
          <h3 className="text-lg font-base text-slate-100">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-blue-500 rounded-full border border-blue-500">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar"
              className="text-base pl-10 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-64"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className={`px-4 py-2 text-sm font-medium text-slate-200 border ${
              activeFiltersCount > 0 ? 'border-blue-500 hover:bg-blue-500' : 'border-slate-700 pointer-events-none'
            } rounded-md transition-colors`}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="text-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <div>
          <ManageableDropdown
            label="Deportes"
            value={filters.sports[0] || ''}
            items={settings?.sports || []}
            category="sport"
            onChange={(value) => onSportsChange(value ? [value] : [])}
            placeholder="Todos los deportes"
          />
        </div>

        <div>
          <ManageableDropdown
            label="Canales"
            value={filters.channels[0] || ''}
            items={settings?.channels || []}
            category="channel"
            onChange={(value) => onChannelsChange(value ? [value] : [])}
            placeholder="Todos los canales"
          />
        </div>

        <div>
          <label htmlFor="yield-min-input" className="block text-sm font-medium text-slate-300 mb-2">
            Yield Mínimo (%)
          </label>
          <input
            id="yield-min-input"
            type="number"
            value={filters.yieldMin === -1000 ? '' : filters.yieldMin}
            onChange={(e) => {
              const value = e.target.value === '' ? -1000 : Number.parseFloat(e.target.value);
              onYieldMinChange(value);
            }}
            placeholder="Sin filtro"
            className={`w-full h-[42px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
              filters.yieldMin !== -1000 && filters.yieldMin !== null
                ? 'ring-1 ring-blue-500 border-blue-500'
                : ''
            }`}
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="last-pick-select" className="block text-sm font-medium text-slate-300 mb-2">
            Último Pick
          </label>
          <div className="relative">
            <select
              id="last-pick-select"
              value={filters.lastPickDays}
              onChange={(e) =>
                onLastPickDaysChange(e.target.value as DashboardFiltersState['lastPickDays'])
              }
              className={`w-full h-[42px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                filters.lastPickDays === 'all' ? 'text-slate-500' : 'text-slate-100 ring-1 ring-blue-500 border-blue-500'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px 16px',
              }}
            >
              <option value="all" className="text-slate-500">Todos</option>
              <option value="7" className="text-slate-100">Últimos 7 días</option>
              <option value="30" className="text-slate-100">Últimos 30 días</option>
              <option value="90" className="text-slate-100">Últimos 90 días</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sort-by-select" className="block text-sm font-medium text-slate-300 mb-2">
            Ordenar por
          </label>
          <div className="relative">
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => onSortByChange(e.target.value as DashboardFiltersState['sortBy'])}
              className="w-full h-[42px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md text-slate-100 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px 16px',
              }}
            >
              <option value="yield" className="text-slate-100">Yield</option>
              <option value="winrate" className="text-slate-100">Winrate</option>
              <option value="totalProfit" className="text-slate-100">Beneficio Total</option>
              <option value="totalFollowed" className="text-slate-100">Picks Seguidos</option>
              <option value="lastPickDate" className="text-slate-100">Último Pick</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
