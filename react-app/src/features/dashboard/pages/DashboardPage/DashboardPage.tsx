/**
 * DashboardPage
 * Main dashboard view with personal stats, filters, and tipster grid
 */

import { useState } from 'react';
import { Download } from 'lucide-react';
import { PersonalStatsPanel, DashboardFilters, TipsterCard } from '../../components';
import { useDashboardFilters } from '../../hooks';
import { usePicks } from '@features/picks/hooks';
import { useFollows } from '@features/follows/hooks';
import { useTipsters } from '@features/tipsters/hooks';

export function DashboardPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
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
  
  const { picks } = usePicks();
  const { follows } = useFollows();
  const { tipsters: allTipsters } = useTipsters();

  /**
   * 📊 Exportar a Excel usando backend API
   * 
   * Envía los datos al backend Express que:
   * 1. Genera el Excel con xlsx
   * 2. Aplica estilos con Python
   * 3. Retorna el archivo completo
   */
  const handleExportToExcel = async () => {
    console.log('🔵 [EXPORT] Iniciando exportación...');
    console.log('📊 [DATA] Datos disponibles:', {
      picks: picks.length,
      follows: follows.length,
      tipsters: allTipsters.length,
    });
    
    setIsExporting(true);
    
    try {
      // Llamar al backend
      console.log('📡 [API] Llamando a /api/export-excel...');
      
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          picks,
          follows,
          tipsters: allTipsters,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Descargar archivo
      console.log('💾 [DOWNLOAD] Descargando archivo...');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Nombre de archivo con fecha
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `tipster-tracker-export-${dateStr}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ [SUCCESS] Export completado correctamente');
      alert('✅ Excel generado y descargado correctamente!');
      
    } catch (error) {
      console.error('❌ [ERROR] Error al exportar:', error);
      alert(`❌ Error al generar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}\n\n¿Está el backend corriendo en http://localhost:3001?`);
    } finally {
      setIsExporting(false);
    }
  };

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

      {/* Floating Action Button - Export to Excel */}
      <button
        type="button"
        onClick={handleExportToExcel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isExporting}
        className={`
          fixed bottom-8 right-8 z-50
          flex items-center gap-2
          ${isExporting ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          text-white font-medium
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          ${isHovered && !isExporting ? 'px-6 py-4' : 'p-4'}
          disabled:opacity-75
        `}
        title={isExporting ? 'Generando Excel...' : 'Exportar todos los datos a Excel'}
      >
        <Download 
          className={`${isHovered && !isExporting ? 'h-5 w-5' : 'h-6 w-6'} transition-all duration-300 ${isExporting ? 'animate-pulse' : ''}`} 
        />
        {(isHovered || isExporting) && (
          <span className="whitespace-nowrap animate-fade-in">
            {isExporting ? 'Generando Excel...' : 'Exportar a Excel'}
          </span>
        )}
      </button>
    </div>
  );
}
