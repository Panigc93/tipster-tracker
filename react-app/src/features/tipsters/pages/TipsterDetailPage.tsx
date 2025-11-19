import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus, RefreshCcw } from 'lucide-react';
import {
  Button,
  Spinner,
  Alert,
  Badge,
  ConfirmDialog,
  OddsDistributionChart,
  StakeDistributionChart,
  SportDistributionChart,
  PickTypeDistributionChart,
} from '@/shared/components';
import { useSortableTable } from '@shared/hooks';
import { useTipsterDetail, useTipsters } from '../hooks';
import { AddTipsterModal } from '../components';
import { calculateTipsterStats } from '../utils';
import { usePicksByTipster, usePicks } from '@features/picks/hooks';
import { PickTableRow, AddPickModal } from '@features/picks/components';
import { useFollowsByTipster, useFollows } from '@features/follows/hooks';
import { FollowTableRow, AddFollowModal } from '@features/follows/components';
import { calculateTraceability } from '@features/follows/utils';
import { auth } from '@core/config/firebase.config';
import type { Pick, UserFollow } from '@shared/types';

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
  const { updatePick, deletePick } = usePicks();
  const { follows: tipsterFollows, loading: followsLoading } = useFollowsByTipster(id ?? '');
  const { updateFollow, deleteFollow } = useFollows();

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPickModalOpen, setIsAddPickModalOpen] = useState(false);
  const [isEditPickModalOpen, setIsEditPickModalOpen] = useState(false);
  const [selectedPick, setSelectedPick] = useState<Pick | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditFollowModalOpen, setIsEditFollowModalOpen] = useState(false);
  const [selectedFollow, setSelectedFollow] = useState<UserFollow | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSecondResetConfirmOpen, setIsSecondResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sorting for picks table
  const { 
    sortedData: sortedPicks, 
    requestSort: requestPicksSort, 
    getSortIndicator: getPicksSortIndicator 
  } = useSortableTable<Pick>(picks, 'date', 'desc');

  // Enrich follows with sport field from original pick for sorting
  const enrichedFollows = useMemo(() => {
    return tipsterFollows.map(follow => {
      const originalPick = picks.find(p => p.id === follow.pickId);
      return {
        ...follow,
        sport: originalPick?.sport || '',
      };
    });
  }, [tipsterFollows, picks]);

  // Sorting for follows table
  const { 
    sortedData: sortedFollows, 
    requestSort: requestFollowsSort, 
    getSortIndicator: getFollowsSortIndicator 
  } = useSortableTable(enrichedFollows, 'dateTimeFollowed', 'desc');

  // Calculate stats from picks
  const stats = useMemo(() => calculateTipsterStats(picks), [picks]);

  // Calculate traceability stats
  const traceabilityStats = useMemo(
    () => calculateTraceability(picks, tipsterFollows),
    [picks, tipsterFollows]
  );

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

  // Reset tipster handler
  const handleResetTipster = () => {
    setIsResetConfirmOpen(true);
  };

  const handleFirstConfirmReset = () => {
    setIsResetConfirmOpen(false);
    setIsSecondResetConfirmOpen(true);
  };

  const handleFinalConfirmReset = async () => {
    if (!tipster) return;

    setIsResetting(true);
    try {
      // Import repositories dynamically to avoid circular dependencies
      const { pickRepository } = await import('@features/picks/services/pick-repository');
      const { followRepository } = await import('@features/follows/services/follow-repository');
      const { tipsterRepository } = await import('../services/tipster-repository');
      
      // Get current user ID from auth
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Reset tipster completely
      const result = await tipsterRepository.resetTipsterComplete(
        tipster.id,
        userId,
        pickRepository,
        followRepository
      );

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to reset tipster');
      }

      const { deletedPicks, deletedFollows } = result.data || { deletedPicks: 0, deletedFollows: 0 };

      // Show success message
      globalThis.alert(
        `✅ Tipster "${tipster.name}" reseteado correctamente.\n\n` +
        `Se eliminaron ${deletedPicks} picks y ${deletedFollows} follows.`
      );

      // Navigate back to dashboard
      navigate('/');
    } catch (err) {
      console.error('Error resetting tipster:', err);
      globalThis.alert('Error al resetear el tipster: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsResetting(false);
      setIsSecondResetConfirmOpen(false);
    }
  };

  // Pick handlers
  const handleEditPick = (pick: Pick) => {
    setSelectedPick(pick);
    setIsEditPickModalOpen(true);
  };

  const handleDeletePick = async (pick: Pick) => {
    const confirmed = globalThis.confirm(
      `¿Estás seguro de que quieres eliminar esta pick? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await deletePick(pick.id);
    } catch (err) {
      console.error('Error deleting pick:', err);
      globalThis.alert('Error al eliminar la pick');
    }
  };

  const handleEditPickSuccess = () => {
    setIsEditPickModalOpen(false);
    setSelectedPick(null);
  };

  const handleEditFollow = (follow: UserFollow) => {
    setSelectedFollow(follow);
    setIsEditFollowModalOpen(true);
  };

  const handleDeleteFollow = async (follow: UserFollow) => {
    const confirmed = globalThis.confirm(
      `¿Estás seguro de que quieres eliminar este follow? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await deleteFollow(follow.id);
    } catch (err) {
      console.error('Error deleting follow:', err);
      globalThis.alert('Error al eliminar el follow');
    }
  };

  const handleEditFollowSuccess = () => {
    setIsEditFollowModalOpen(false);
    setSelectedFollow(null);
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
                variant="outline"
                size="sm"
                icon={<RefreshCcw className="h-4 w-4" />}
                onClick={handleResetTipster}
                disabled={isResetting || picks.length === 0}
                title={picks.length === 0 ? 'No hay picks para resetear' : 'Resetear tipster'}
              >
                {isResetting ? 'Reseteando...' : 'Resetear'}
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <OddsDistributionChart picks={picks} height={180} />
                      <StakeDistributionChart picks={picks} height={180} />
                      <SportDistributionChart picks={picks} height={180} />
                      <PickTypeDistributionChart picks={picks} height={180} />
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
                            <th 
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                              onClick={() => requestPicksSort('date')}
                              title="Click para ordenar por fecha. Click en otra columna para multi-sort"
                            >
                              <span className="flex items-center gap-1">
                                Fecha {getPicksSortIndicator('date')}
                              </span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Tipster
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Partido
                            </th>
                            <th 
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                              onClick={() => requestPicksSort('sport')}
                              title="Click para ordenar por deporte. Click en otra columna para multi-sort"
                            >
                              <span className="flex items-center gap-1">
                                Deporte {getPicksSortIndicator('sport')}
                              </span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Tipo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Apuesta
                            </th>
                            <th 
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                              onClick={() => requestPicksSort('odds')}
                              title="Click para ordenar por cuota. Click en otra columna para multi-sort"
                            >
                              <span className="flex items-center gap-1">
                                Cuota {getPicksSortIndicator('odds')}
                              </span>
                            </th>
                            <th 
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                              onClick={() => requestPicksSort('stake')}
                              title="Click para ordenar por stake. Click en otra columna para multi-sort"
                            >
                              <span className="flex items-center gap-1">
                                Stake {getPicksSortIndicator('stake')}
                              </span>
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
                          {sortedPicks.map((pick) => (
                            <PickTableRow
                              key={pick.id}
                              pick={pick}
                              tipsterName={tipster.name}
                              showActions={true}
                              onEdit={handleEditPick}
                              onDelete={handleDeletePick}
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
              {(() => {
                if (followsLoading) {
                  return (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  );
                }

                if (tipsterFollows.length === 0) {
                  return (
                    <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-slate-400">
                        Aún no has seguido ninguna pick de este tipster
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Ve a la pestaña "Estadísticas" y haz clic en "Seguir" en las picks que te interesen
                      </p>
                    </div>
                  );
                }

                return (
                <>
                  {/* Seguibilidad */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">
                      Seguibilidad
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Total Picks del Tipster</p>
                        <p className="text-2xl font-bold text-slate-100">
                          {traceabilityStats.totalPicks}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Picks Seguidas</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {traceabilityStats.totalFollows}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Tasa de Seguimiento</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {traceabilityStats.followRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tus Estadísticas de Seguimiento */}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">
                      Tus Estadísticas de Seguimiento
                    </h2>

                    {/* Grid de Stats del Usuario (7 cards) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {/* Total Follows */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Total Follows</p>
                        <p className="text-2xl font-bold text-slate-200">
                          {traceabilityStats.totalFollows}
                        </p>
                      </div>

                      {/* Ganados */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Ganados</p>
                        <p className="text-2xl font-bold text-green-400">
                          {traceabilityStats.userWonFollows}
                        </p>
                      </div>

                      {/* Perdidos */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Perdidos</p>
                        <p className="text-2xl font-bold text-red-400">
                          {traceabilityStats.userResolvedFollows - traceabilityStats.userWonFollows}
                        </p>
                      </div>

                      {/* Winrate */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Winrate</p>
                        <p className="text-2xl font-bold text-slate-200">
                          {traceabilityStats.userWinrate.toFixed(1)}%
                        </p>
                      </div>

                      {/* Yield */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Yield</p>
                        <p
                          className={`text-2xl font-bold ${
                            traceabilityStats.userYield >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {traceabilityStats.userYield >= 0 ? '+' : ''}
                          {traceabilityStats.userYield.toFixed(2)}%
                        </p>
                      </div>

                      {/* Profit Total */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Profit Total</p>
                        <p
                          className={`text-2xl font-bold ${
                            traceabilityStats.userProfit >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {traceabilityStats.userProfit >= 0 ? '+' : ''}
                          {traceabilityStats.userProfit.toFixed(2)}u
                        </p>
                      </div>

                      {/* Match Rate */}
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Match Rate</p>
                        <p
                          className={`text-2xl font-bold ${
                            traceabilityStats.matchRate >= 80
                              ? 'text-green-400'
                              : traceabilityStats.matchRate >= 50
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {traceabilityStats.matchRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Resumen Comparativo */}
                    <div
                      className={`rounded-lg p-4 border mb-6 ${
                        traceabilityStats.yieldDiff >= 2
                          ? 'bg-green-500/10 border-green-500/30'
                          : traceabilityStats.yieldDiff <= -2
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {traceabilityStats.yieldDiff >= 2
                            ? '🟢'
                            : traceabilityStats.yieldDiff <= -2
                              ? '🔴'
                              : '⚪'}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              traceabilityStats.yieldDiff >= 2
                                ? 'text-green-400'
                                : traceabilityStats.yieldDiff <= -2
                                  ? 'text-red-400'
                                  : 'text-blue-400'
                            }`}
                          >
                            {traceabilityStats.yieldDiff >= 2
                              ? `Superando al tipster en +${traceabilityStats.yieldDiff.toFixed(2)}% yield`
                              : traceabilityStats.yieldDiff <= -2
                                ? `Por debajo del tipster en ${traceabilityStats.yieldDiff.toFixed(2)}% yield`
                                : 'Rendimiento similar al tipster'}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Comparado con el yield del tipster ({traceabilityStats.tipsterYield.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts de Follows */}
                  {(() => {
                    // Get original picks from follows
                    const followedPicks = tipsterFollows
                      .map(follow => picks.find(pick => pick.id === follow.pickId))
                      .filter((pick): pick is Pick => pick !== undefined);

                    if (followedPicks.length === 0) {
                      return null;
                    }

                    return (
                      <div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-4">
                          Distribuciones de tus Follows
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                          <OddsDistributionChart follows={tipsterFollows} height={180} title="Tus Cuotas" />
                          <StakeDistributionChart follows={tipsterFollows} height={180} title="Tus Stakes" />
                          <SportDistributionChart picks={followedPicks} height={180} title="Deportes Seguidos" />
                          <PickTypeDistributionChart picks={followedPicks} height={180} title="Tipos de Pick Seguidos" />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Historial de Picks Seguidas */}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">
                      Historial de Picks Seguidas ({tipsterFollows.length})
                    </h2>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-blue-500/10 border-b border-slate-700">
                            <tr>
                              <th 
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                                onClick={() => requestFollowsSort('dateTimeFollowed')}
                                title="Click para ordenar por fecha. Click en otra columna para multi-sort"
                              >
                                <span className="flex items-center gap-1">
                                  Fecha {getFollowsSortIndicator('dateTimeFollowed')}
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Tipster
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Partido
                              </th>
                              <th 
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                                onClick={() => requestFollowsSort('sport')}
                                title="Click para ordenar por deporte. Click en otra columna para multi-sort"
                              >
                                <span className="flex items-center gap-1">
                                  Deporte {getFollowsSortIndicator('sport')}
                                </span>
                              </th>
                              <th 
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                                onClick={() => requestFollowsSort('userOdds')}
                                title="Click para ordenar por cuota. Click en otra columna para multi-sort"
                              >
                                <span className="flex items-center gap-1">
                                  Cuota {getFollowsSortIndicator('userOdds')}
                                </span>
                              </th>
                              <th 
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-colors select-none"
                                onClick={() => requestFollowsSort('userStake')}
                                title="Click para ordenar por stake. Click en otra columna para multi-sort"
                              >
                                <span className="flex items-center gap-1">
                                  Stake {getFollowsSortIndicator('userStake')}
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Resultado
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Profit
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Match
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700">
                            {sortedFollows.map((follow) => {
                              const originalPick = picks.find((p) => p.id === follow.pickId);
                              if (!originalPick) return null;

                              return (
                                <FollowTableRow
                                  key={follow.id}
                                  follow={follow}
                                  pick={originalPick}
                                  tipsterName={tipster.name}
                                  onEdit={() => handleEditFollow(follow)}
                                  onDelete={() => handleDeleteFollow(follow)}
                                />
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
                );
              })()}
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
          initialTipsterId={tipster.id}
        />

        {/* Edit Pick Modal */}
        {selectedPick && (
          <AddPickModal
            isOpen={isEditPickModalOpen}
            onClose={() => {
              setIsEditPickModalOpen(false);
              setSelectedPick(null);
            }}
            onSuccess={handleEditPickSuccess}
            tipsters={[tipster]}
            pick={selectedPick}
            onUpdate={updatePick}
          />
        )}

        {/* Edit Follow Modal */}
        {selectedFollow && (() => {
          const followPick = picks.find((p) => p.id === selectedFollow.pickId);
          return (
            <AddFollowModal
              isOpen={isEditFollowModalOpen}
              onClose={() => {
                setIsEditFollowModalOpen(false);
                setSelectedFollow(null);
              }}
              onSuccess={handleEditFollowSuccess}
              follow={selectedFollow}
              pick={followPick}
              tipsterName={tipster.name}
              onUpdate={updateFollow}
            />
          );
        })()}

        {/* Reset Tipster - First Confirmation */}
        <ConfirmDialog
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={handleFirstConfirmReset}
          title="⚠️ Resetear Tipster"
          message={`Vas a resetear "${tipster.name}".\n\nEsto eliminará:\n• Todos los picks de este tipster (${picks.length} picks)\n• Todos tus follows de este tipster (${tipsterFollows.length} follows)\n\nEsta acción NO se puede deshacer.\n\n¿Estás seguro de continuar?`}
          confirmText="Sí, continuar"
          cancelText="Cancelar"
          isDangerous={true}
        />

        {/* Reset Tipster - Second Confirmation */}
        <ConfirmDialog
          isOpen={isSecondResetConfirmOpen}
          onClose={() => setIsSecondResetConfirmOpen(false)}
          onConfirm={handleFinalConfirmReset}
          title="⚠️ Última Confirmación"
          message={`Última confirmación: ¿Seguro que quieres resetear "${tipster.name}"?\n\nSe eliminarán permanentemente ${picks.length} picks y ${tipsterFollows.length} follows.`}
          confirmText="Sí, resetear definitivamente"
          cancelText="No, cancelar"
          isDangerous={true}
          isLoading={isResetting}
        />
    </>
  );
}
