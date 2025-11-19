/**
 * @fileoverview AdvancedFilters - Advanced filtering component for picks
 * @module features/picks/components/AdvancedFilters
 */

import { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@shared/components/ui';
import type { PickFilters } from '../../pages/PicksListPage/PicksListPage.types';
import type { Tipster } from '@shared/types';

export interface AdvancedFiltersProps {
  filters: PickFilters;
  onFilterChange: (filters: Partial<PickFilters>) => void;
  onReset: () => void;
  tipsters: Tipster[];
  availableSports: string[];
  availableBookmakers: string[];
}

/**
 * AdvancedFilters component
 * Provides advanced filtering options for picks
 */
export function AdvancedFilters({
  filters,
  onFilterChange,
  onReset,
  tipsters,
  availableSports,
  availableBookmakers,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.tipsterIds.length > 0 ||
    filters.sports.length > 0 ||
    filters.bookmakers.length > 0 ||
    filters.pickType ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.oddsMin !== null ||
    filters.oddsMax !== null ||
    filters.stakeMin !== null ||
    filters.stakeMax !== null ||
    filters.searchQuery;

  const activeFiltersCount =
    filters.tipsterIds.length +
    filters.sports.length +
    filters.bookmakers.length +
    (filters.pickType ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.oddsMin !== null ? 1 : 0) +
    (filters.oddsMax !== null ? 1 : 0) +
    (filters.stakeMin !== null ? 1 : 0) +
    (filters.stakeMax !== null ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const toggleTipster = (tipsterId: string) => {
    const newTipsterIds = filters.tipsterIds.includes(tipsterId)
      ? filters.tipsterIds.filter((id) => id !== tipsterId)
      : [...filters.tipsterIds, tipsterId];
    onFilterChange({ tipsterIds: newTipsterIds });
  };

  const toggleSport = (sport: string) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport];
    onFilterChange({ sports: newSports });
  };

  const toggleBookmaker = (bookmaker: string) => {
    const newBookmakers = filters.bookmakers.includes(bookmaker)
      ? filters.bookmakers.filter((b) => b !== bookmaker)
      : [...filters.bookmakers, bookmaker];
    onFilterChange({ bookmakers: newBookmakers });
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-slate-200 hover:text-slate-100 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span className="font-semibold">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {hasActiveFilters && (
          <Button variant="secondary" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          {/* Search */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Buscar por partido, tipo de apuesta..."
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange({ dateTo: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pick Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de Pick
            </label>
            <select
              value={filters.pickType}
              onChange={(e) => onFilterChange({ pickType: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pre">Pre</option>
              <option value="Live">Live</option>
              <option value="Combinado">Combinado</option>
            </select>
          </div>

          {/* Odds Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cuota mínima
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={filters.oddsMin ?? ''}
              onChange={(e) =>
                onFilterChange({ oddsMin: e.target.value ? parseFloat(e.target.value) : null })
              }
              placeholder="Ej: 1.50"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cuota máxima
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={filters.oddsMax ?? ''}
              onChange={(e) =>
                onFilterChange({ oddsMax: e.target.value ? parseFloat(e.target.value) : null })
              }
              placeholder="Ej: 3.00"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stake Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stake mínimo
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={filters.stakeMin ?? ''}
              onChange={(e) =>
                onFilterChange({ stakeMin: e.target.value ? parseInt(e.target.value) : null })
              }
              placeholder="1-10"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stake máximo
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={filters.stakeMax ?? ''}
              onChange={(e) =>
                onFilterChange({ stakeMax: e.target.value ? parseInt(e.target.value) : null })
              }
              placeholder="1-10"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Multi-select Tipsters */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipsters ({filters.tipsterIds.length} seleccionados)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto">
              {tipsters.map((tipster) => (
                <button
                  key={tipster.id}
                  onClick={() => toggleTipster(tipster.id)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filters.tipsterIds.includes(tipster.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tipster.name}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-select Sports */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Deportes ({filters.sports.length} seleccionados)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-700 rounded-lg">
              {availableSports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filters.sports.includes(sport)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-select Bookmakers */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bookmakers ({filters.bookmakers.length} seleccionados)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto">
              {availableBookmakers.map((bookmaker) => (
                <button
                  key={bookmaker}
                  onClick={() => toggleBookmaker(bookmaker)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filters.bookmakers.includes(bookmaker)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {bookmaker}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
