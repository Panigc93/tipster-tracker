/**
 * DashboardPage
 * Main dashboard view with personal stats, filters, and tipster grid
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { PersonalStatsPanel, DashboardFilters, TipsterCard } from '../../components';
import { useDashboardFilters } from '../../hooks';
import { usePicks } from '@features/picks/hooks';
import { useFollows } from '@features/follows/hooks';
import { SkeletonText, SkeletonCard } from '@shared/components/ui';

export function DashboardPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    tipsters: filteredTipsters,
    allTipsters,
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
  toast.success('✅ Excel generado y descargado correctamente!');
      
    } catch (error) {
      console.error('❌ [ERROR] Error al exportar:', error);
  toast.error(`❌ Error al generar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}\n\n¿Está el backend corriendo en http://localhost:3001?`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Tipsters</h1>
          <p className="mt-1 text-sm text-gray-400">
            Seguimiento de tus tipsters
          </p>
        </div>
      </div>
      <div className="max-w-8xl mx-auto flex flex-col gap-4 mt-6">
        <PersonalStatsPanel />
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
        {isLoading && (
          <div className="space-y-6 shadow-md">
            <div className="flex items-center justify-between">
              <SkeletonText width="200px" height="20px" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} height="280px" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && filteredTipsters.length === 0 && (
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center shadow-md">
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
                className="text-base px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!isLoading && filteredTipsters.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">
                Mostrando {filteredTipsters.length} tipster{filteredTipsters.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 shadow-md">
              {filteredTipsters.map((tipster) => (
                <TipsterCard key={tipster.id} tipster={tipster} />
              ))}
            </div>
          </div>
        )}
      </div>

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
          transition-all duration-300 ease-in-out
          ${isHovered && !isExporting ? 'px-4 py-2' : 'p-3'}
          disabled:opacity-75
        `}
        title={isExporting ? 'Generando Excel...' : 'Exportar todos los datos a Excel'}
      >
        <Download 
          className={`${isHovered && !isExporting ? 'h-3 w-3' : 'h-4 w-4'} transition-all duration-300 ${isExporting ? 'animate-pulse' : ''}`} 
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
