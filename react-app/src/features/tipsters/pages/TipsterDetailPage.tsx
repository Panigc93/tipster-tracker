import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Alert,
  ConfirmDialog,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  LoadingOverlay,
} from '@/shared/components';

import { useTipsterDetail, useTipsters } from '../hooks';
import { AddTipsterModal } from '../components';
import { calculateTipsterStats, type TipsterStats } from '../utils';
import { usePicksByTipster, usePicks } from '@features/picks/hooks';
import { AddPickModal } from '@features/picks/components';
import { useFollowsByTipster, useFollows } from '@features/follows/hooks';
import { AddFollowModal } from '@features/follows/components';
import { calculateTraceability, type TraceabilityStats } from '@features/follows/utils';
import { auth } from '@core/config/firebase.config';
import type { Pick, UserFollow } from '@/shared/types';

// New components
import {
  TipsterHeader,
  GeneralStats,
  UserStats,
  TipsterCharts,
  PicksHistory,
  FollowsHistory,
} from '../components/TipsterDetail';

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
  const { deletePick } = usePicks();
  const { follows: tipsterFollows, loading: followsLoading } = useFollowsByTipster(id ?? '');
  const { deleteFollow } = useFollows();

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
  
  const [isDeleteTipsterConfirmOpen, setIsDeleteTipsterConfirmOpen] = useState(false);
  const [isDeletePickConfirmOpen, setIsDeletePickConfirmOpen] = useState(false);
  const [pickToDelete, setPickToDelete] = useState<Pick | null>(null);
  const [isDeleteFollowConfirmOpen, setIsDeleteFollowConfirmOpen] = useState(false);
  const [followToDelete, setFollowToDelete] = useState<UserFollow | null>(null);

  const stats: TipsterStats = useMemo(() => calculateTipsterStats(picks), [picks]);

  const traceabilityStats: TraceabilityStats = useMemo(
    () => calculateTraceability(picks, tipsterFollows),
    [picks, tipsterFollows]
  );

  const handleBack = () => {
    navigate('/');
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    void refreshTipster();
  };

  const handleDelete = () => {
    setIsDeleteTipsterConfirmOpen(true);
  };

  const handleConfirmDeleteTipster = async () => {
    if (!tipster) return;

    setIsDeleting(true);
    try {
      await deleteTipster(tipster.id);
      toast.success('Tipster eliminado correctamente');
      navigate('/');
    } catch (err) {
      console.error('Error deleting tipster:', err);
      toast.error('Error al eliminar el tipster');
    } finally {
      setIsDeleting(false);
      setIsDeleteTipsterConfirmOpen(false);
    }
  };

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
      const { pickRepository } = await import('@features/picks/services/pick-repository');
      const { followRepository } = await import('@features/follows/services/follow-repository');
      const { tipsterRepository } = await import('../services/tipster-repository');
      
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

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

      toast.success(
        `✅ Tipster "${tipster.name}" reseteado correctamente.\n\n` +
        `Se eliminaron ${deletedPicks} picks y ${deletedFollows} follows.`
      );

      navigate('/');
    } catch (err) {
      console.error('Error resetting tipster:', err);
      toast.error('Error al resetear el tipster: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsResetting(false);
      setIsSecondResetConfirmOpen(false);
    }
  };

  const handleEditPick = (pick: Pick) => {
    setSelectedPick(pick);
    setIsEditPickModalOpen(true);
  };

  const handleDeletePick = (pick: Pick) => {
    setPickToDelete(pick);
    setIsDeletePickConfirmOpen(true);
  };

  const handleConfirmDeletePick = async () => {
    if (!pickToDelete) return;

    try {
      await deletePick(pickToDelete.id);
      toast.success('Pick eliminada correctamente');
    } catch (err) {
      console.error('Error deleting pick:', err);
      toast.error('Error al eliminar la pick');
    } finally {
      setIsDeletePickConfirmOpen(false);
      setPickToDelete(null);
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

  const handleDeleteFollow = (follow: UserFollow) => {
    setFollowToDelete(follow);
    setIsDeleteFollowConfirmOpen(true);
  };

  const handleConfirmDeleteFollow = async () => {
    if (!followToDelete) return;

    try {
      await deleteFollow(followToDelete.id);
      toast.success('Follow eliminado correctamente');
    } catch (err) {
      console.error('Error deleting follow:', err);
      toast.error('Error al eliminar el follow');
    } finally {
      setIsDeleteFollowConfirmOpen(false);
      setFollowToDelete(null);
    }
  };

  const handleEditFollowSuccess = () => {
    setIsEditFollowModalOpen(false);
    setSelectedFollow(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonText width="100px" height="36px" />

        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3">
            <SkeletonText width="300px" height="36px" />
            <div className="flex items-center gap-3">
              <SkeletonText width="80px" height="24px" />
              <SkeletonText width="150px" height="16px" />
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonText width="80px" height="36px" />
            <SkeletonText width="90px" height="36px" />
            <SkeletonText width="90px" height="36px" />
          </div>
        </div>

        <div className="border-b border-slate-700">
          <div className="flex space-x-8">
            <SkeletonText width="120px" height="40px" />
            <SkeletonText width="140px" height="40px" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} height="100px" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} height="200px" />
          ))}
        </div>

        <SkeletonTable rows={8} columns={11} />
      </div>
    );
  }

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
    <LoadingOverlay isLoading={isResetting} message="Reseteando tipster...">
      {/* Header */}
      <TipsterHeader
        tipster={tipster}
        onEdit={() => setIsEditModalOpen(true)}
        onReset={handleResetTipster}
        onDelete={handleDelete}
        isResetting={isResetting}
        isDeleting={isDeleting}
        hasPicks={picks.length > 0}
      />

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
      <div className="bg-slate-800 rounded-lg border border-slate-700 py-2 px-4">
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Estadísticas Generales */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-200">
                  Estadísticas Generales
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                  onClick={() => setIsAddPickModalOpen(true)}
                >
                  Añadir Pick
                </Button>
              </div>

              <GeneralStats 
                stats={stats} 
                loading={picksLoading} 
                onAddPick={() => setIsAddPickModalOpen(true)}
                hasPicks={picks.length > 0}
              />

              {picks.length > 0 && (
                <>
                  <TipsterCharts picks={picks} />
                  <div className="mt-8">
                    <PicksHistory 
                      picks={picks} 
                      tipsterName={tipster.name}
                      onEdit={handleEditPick}
                      onDelete={handleDeletePick}
                    />
                  </div>
                </>
              )}
            </div>
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

              const followedPicks = tipsterFollows
                .map(follow => picks.find(pick => pick.id === follow.pickId))
                .filter((pick): pick is Pick => pick !== undefined);

              return (
                <>
                  <UserStats 
                    stats={traceabilityStats} 
                    loading={followsLoading}
                    tipsterYield={stats.yield}
                  />

                  {followedPicks.length > 0 && (
                    <TipsterCharts 
                      picks={followedPicks} 
                      follows={tipsterFollows}
                      title="Distribuciones de tus Follows" 
                    />
                  )}

                  <div className="mt-8">
                    <FollowsHistory 
                      follows={tipsterFollows}
                      picks={picks}
                      tipsterName={tipster.name}
                      onEdit={handleEditFollow}
                      onDelete={handleDeleteFollow}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTipsterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async (data) => {
          await updateTipster(tipster.id, data);
        }}
        tipster={tipster}
        onSuccess={handleEditSuccess}
      />

      <AddPickModal
        isOpen={isAddPickModalOpen}
        onClose={() => setIsAddPickModalOpen(false)}
        tipsters={[tipster]}
        initialTipsterId={tipster.id}
        onSuccess={() => {
          setIsAddPickModalOpen(false);
          // Refresh picks handled by hook/firebase subscription
        }}
      />

      {selectedPick && (
        <AddPickModal
          isOpen={isEditPickModalOpen}
          onClose={() => {
            setIsEditPickModalOpen(false);
            setSelectedPick(null);
          }}
          tipsters={[tipster]}
          pick={selectedPick || undefined}
          onSuccess={handleEditPickSuccess}
        />
      )}

      {selectedFollow && (
        <AddFollowModal
          isOpen={isEditFollowModalOpen}
          onClose={() => {
            setIsEditFollowModalOpen(false);
            setSelectedFollow(null);
          }}
          pick={picks.find(p => p.id === selectedFollow.pickId)}
          follow={selectedFollow || undefined}
          onSuccess={handleEditFollowSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteTipsterConfirmOpen}
        onClose={() => setIsDeleteTipsterConfirmOpen(false)}
        onConfirm={handleConfirmDeleteTipster}
        title="Eliminar Tipster"
        message={`¿Estás seguro de que quieres eliminar a ${tipster.name}? Esta acción no se puede deshacer y eliminará todas sus picks y estadísticas.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleFirstConfirmReset}
        title="Resetear Tipster"
        message={`¿Estás seguro de que quieres resetear a ${tipster.name}? Se eliminarán TODAS sus picks y estadísticas, pero se mantendrá el tipster.`}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={isSecondResetConfirmOpen}
        onClose={() => setIsSecondResetConfirmOpen(false)}
        onConfirm={handleFinalConfirmReset}
        title="Confirmación Final"
        message="Esta acción es IRREVERSIBLE. ¿Estás absolutamente seguro?"
        confirmText="Sí, resetear todo"
        cancelText="Cancelar"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={isDeletePickConfirmOpen}
        onClose={() => setIsDeletePickConfirmOpen(false)}
        onConfirm={handleConfirmDeletePick}
        title="Eliminar Pick"
        message="¿Estás seguro de que quieres eliminar esta pick? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={isDeleteFollowConfirmOpen}
        onClose={() => setIsDeleteFollowConfirmOpen(false)}
        onConfirm={handleConfirmDeleteFollow}
        title="Eliminar Follow"
        message="¿Estás seguro de que quieres eliminar este follow? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
      />
    </LoadingOverlay>
  );
}
