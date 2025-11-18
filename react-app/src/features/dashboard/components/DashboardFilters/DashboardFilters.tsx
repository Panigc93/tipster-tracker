/**
 * DashboardFilters component
 * Comprehensive filtering UI for dashboard tipsters
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { ALL_SPORTS, ALL_CHANNELS } from '@shared/constants';
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
  const [sportsOpen, setSportsOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const sportsRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sportsRef.current && !sportsRef.current.contains(event.target as Node)) {
        setSportsOpen(false);
      }
      if (channelsRef.current && !channelsRef.current.contains(event.target as Node)) {
        setChannelsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle all sports
  const toggleAllSports = () => {
    if (filters.sports.length === ALL_SPORTS.length) {
      // If all selected, deselect all
      onSportsChange([]);
    } else {
      // Select all
      onSportsChange([...ALL_SPORTS]);
    }
  };

  // Toggle sport in array
  const toggleSport = (sport: string) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport];
    onSportsChange(newSports);
  };

  // Toggle all channels
  const toggleAllChannels = () => {
    if (filters.channels.length === ALL_CHANNELS.length) {
      // If all selected, deselect all
      onChannelsChange([]);
    } else {
      // Select all
      onChannelsChange([...ALL_CHANNELS]);
    }
  };

  // Toggle channel in array
  const toggleChannel = (channel: string) => {
    const newChannels = filters.channels.includes(channel)
      ? filters.channels.filter((c) => c !== channel)
      : [...filters.channels, channel];
    onChannelsChange(newChannels);
  };

  // Get display text for sports dropdown
  const getSportsDisplayText = () => {
    if (filters.sports.length === 0) return 'Todos los deportes';
    const plural = filters.sports.length > 1 ? 's' : '';
    return `${filters.sports.length} seleccionado${plural}`;
  };

  // Get display text for channels dropdown
  const getChannelsDisplayText = () => {
    if (filters.channels.length === 0) return 'Todos los canales';
    const plural = filters.channels.length > 1 ? 's' : '';
    return `${filters.channels.length} seleccionado${plural}`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-100">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar tipster..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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

          {/* Reset button */}
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Sports multi-select dropdown */}
        <div className="relative" ref={sportsRef}>
          <div className="block text-sm font-medium text-slate-300 mb-2">Deportes</div>
          <button
            type="button"
            onClick={() => setSportsOpen(!sportsOpen)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-left flex items-center justify-between hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-sm">{getSportsDisplayText()}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${sportsOpen ? 'rotate-180' : ''}`} />
          </button>
          {sportsOpen && (
            <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {/* Select All option */}
              <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-700 bg-slate-850">
                <input
                  type="checkbox"
                  checked={filters.sports.length === ALL_SPORTS.length}
                  onChange={toggleAllSports}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-slate-100 font-medium">Todos los deportes</span>
              </label>
              
              {/* Individual sports */}
              {ALL_SPORTS.map((sport: string) => (
                <label
                  key={sport}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.sports.includes(sport)}
                    onChange={() => toggleSport(sport)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-300">{sport}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Channels multi-select dropdown */}
        <div className="relative" ref={channelsRef}>
          <div className="block text-sm font-medium text-slate-300 mb-2">Canales</div>
          <button
            type="button"
            onClick={() => setChannelsOpen(!channelsOpen)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-left flex items-center justify-between hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-sm">{getChannelsDisplayText()}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${channelsOpen ? 'rotate-180' : ''}`} />
          </button>
          {channelsOpen && (
            <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {/* Select All option */}
              <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-700 bg-slate-850">
                <input
                  type="checkbox"
                  checked={filters.channels.length === ALL_CHANNELS.length}
                  onChange={toggleAllChannels}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-slate-100 font-medium">Todos los canales</span>
              </label>
              
              {/* Individual channels */}
              {ALL_CHANNELS.map((channel: string) => (
                <label
                  key={channel}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.channels.includes(channel)}
                    onChange={() => toggleChannel(channel)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-300">{channel}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Yield min */}
        <div>
          <label htmlFor="yield-min-input" className="block text-sm font-medium text-slate-300 mb-2">
            Yield Mínimo (%)
          </label>
          <input
            id="yield-min-input"
            type="number"
            value={filters.yieldMin === -1000 ? '' : filters.yieldMin}
            onChange={(e) => {
              const value = e.target.value === '' ? -1000 : Number(e.target.value);
              onYieldMinChange(value);
            }}
            placeholder="Sin filtro"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.1"
          />
        </div>

        {/* Last pick days */}
        <div>
          <label htmlFor="last-pick-select" className="block text-sm font-medium text-slate-300 mb-2">
            Último Pick
          </label>
          <select
            id="last-pick-select"
            value={filters.lastPickDays}
            onChange={(e) =>
              onLastPickDaysChange(e.target.value as DashboardFiltersState['lastPickDays'])
            }
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="7">Últimos 7 días</option>
            <option value="14">Últimos 14 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>

        {/* Sort by */}
        <div>
          <label htmlFor="sort-by-select" className="block text-sm font-medium text-slate-300 mb-2">
            Ordenar por
          </label>
          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={(e) => onSortByChange(e.target.value as DashboardFiltersState['sortBy'])}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="yield">Yield</option>
            <option value="winrate">Winrate</option>
            <option value="totalPicks">Total Picks</option>
            <option value="traceability">Seguibilidad</option>
            <option value="lastPick">Último Pick</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>
    </div>
  );
}
