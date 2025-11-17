import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { Button, Spinner, Alert, Badge } from '@/shared/components/ui';
import { useTipsterDetail, useTipsters } from '../hooks';
import { AddTipsterModal } from '../components';
import { calculateTipsterStats } from '../utils';
import { usePicksByTipster } from '@features/picks/hooks';
import { PickTableRow, AddPickModal } from '@features/picks/components';

type TabType = 'stats' | 'my-stats';

/**
 * TipsterDetail page
 * Detailed view of a single tipster with stats and picks
 */
export function TipsterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tipster, loading, error, refreshTipster } = useTipsterDetail(id ?? '');
  const { updateTipster, deleteTipster } = useTipsters();
  const { picks, loading: picksLoading } = usePicksByTipster(id ?? '');

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPickModalOpen, setIsAddPickModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate stats from picks
  const stats = useMemo(() => calculateTipsterStats(picks), [picks]);

  const handleBack = () => {
    navigate('/tipsters');
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    void refreshTipster();
  };

  const handleDelete = async () => {
    if (!tipster) return;

    const confirmed = globalThis.confirm(
      `¿Estás seguro de que quieres eliminar al tipster "${tipster.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteTipster(tipster.id);
      navigate('/tipsters');
    } catch (err) {
      console.error('Error deleting tipster:', err);
      globalThis.alert('Error al eliminar el tipster');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error || !tipster) {
    return (
      <>
        <Alert variant="error" className="mb-6">
          {error || 'No se encontró el tipster'}
        </Alert>
        <Button variant="secondary" onClick={handleBack}>
          Volver a Tipsters
        </Button>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={handleBack}
            className="mb-4"
          >
            Volver
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-200 mb-2">
                {tipster.name}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="info">{tipster.channel}</Badge>
                <span className="text-sm text-slate-400">
                  Creado: {new Date(tipster.createdDate).toLocaleDateString()}
                </span>
                {tipster.lastPickDate && (
                  <span className="text-sm text-slate-400">
                    Última pick:{' '}
                    {new Date(tipster.lastPickDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Edit2 className="h-4 w-4" />}
                onClick={() => setIsEditModalOpen(true)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'stats', label: 'Estadísticas' },
                { id: 'my-stats', label: 'Mis Estadísticas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Estadísticas Generales */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-200">
                    Estadísticas Generales
                  </h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAddPickModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Pick
                  </Button>
                </div>

                {(() => {
                  if (picksLoading) {
                    return (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                      </div>
                    );
                  }

                  if (picks.length === 0) {
                    return (
                      <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-700">
                        <p className="text-slate-400 mb-4">
                          Aún no hay picks registradas para este tipster
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setIsAddPickModalOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Añadir Primera Pick
                        </Button>
                      </div>
                    );
                  }

                  return (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Total Picks</p>
                        <p className="text-2xl font-bold text-slate-100">{stats.totalPicks}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Resueltas</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.resolvedPicks}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Ganadas</p>
                        <p className="text-2xl font-bold text-green-400">{stats.wonPicks}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Winrate</p>
                        <p className="text-2xl font-bold text-slate-100">{stats.winrate}%</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Yield</p>
                        <p className={`text-2xl font-bold ${
                          (() => {
                            if (stats.yield > 0) return 'text-green-400';
                            if (stats.yield < 0) return 'text-red-400';
                            return 'text-slate-100';
                          })()
                        }`}>
                          {stats.yield > 0 ? '+' : ''}{stats.yield}%
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Profit</p>
                        <p className={`text-2xl font-bold ${
                          (() => {
                            if (stats.profit > 0) return 'text-green-400';
                            if (stats.profit < 0) return 'text-red-400';
                            return 'text-slate-100';
                          })()
                        }`}>
                          {stats.profit > 0 ? '+' : ''}{stats.profit}u
                        </p>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Pendientes</p>
                        <p className="text-lg font-semibold text-yellow-400">{stats.pendingPicks}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Perdidas</p>
                        <p className="text-lg font-semibold text-red-400">{stats.lostPicks}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Cuota Media</p>
                        <p className="text-lg font-semibold text-slate-100">{stats.avgOdds}</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Stake Medio</p>
                        <p className="text-lg font-semibold text-slate-100">{stats.avgStake}u</p>
                      </div>
                    </div>
                  </>
                  );
                })()}
              </div>

              {/* Historial de Picks */}
              {picks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-200 mb-4">
                    Historial de Picks ({picks.length})
                  </h2>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-blue-500/10 border-b border-slate-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Fecha
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
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {picks.map((pick) => (
                            <PickTableRow
                              key={pick.id}
                              pick={pick}
                              tipsterName={tipster.name}
                              showActions={false}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-stats' && (
            <div className="space-y-8">
              {/* Comparación de Estadísticas */}
              <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4">
                  Comparación: Tipster vs Mis Follows
                </h2>
                <div className="text-slate-400 text-center py-8">
                  <p>Comparación de estadísticas se mostrará aquí</p>
                  <p className="text-sm mt-2">
                    Se calculará cuando se implementen los follows (Fase 6)
                  </p>
                </div>
              </div>

              {/* Picks Seguidas */}
              <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4">
                  Picks Seguidas
                </h2>
                <div className="text-slate-400 text-center py-8">
                  <p>Lista de picks seguidas se mostrará aquí</p>
                  <p className="text-sm mt-2">
                    Se implementará en la Fase 6 (Feature Follows)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Tipster Modal */}
        <AddTipsterModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          tipster={tipster}
          onUpdate={updateTipster}
        />

        {/* Add Pick Modal */}
        <AddPickModal
          isOpen={isAddPickModalOpen}
          onClose={() => setIsAddPickModalOpen(false)}
          onSuccess={() => {
            setIsAddPickModalOpen(false);
            // Refresh is automatic via listener
          }}
          tipsters={[tipster]}
        />
    </>
  );
}
