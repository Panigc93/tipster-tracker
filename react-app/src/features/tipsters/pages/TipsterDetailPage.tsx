import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button, Spinner, Alert, Badge } from '@/shared/components/ui';
import { useTipsterDetail, useTipsters } from '../hooks';
import { AddTipsterModal } from '../components';

type TabType = 'stats' | 'my-stats' | 'follows' | 'historial';

/**
 * TipsterDetail page
 * Detailed view of a single tipster with stats and picks
 */
export function TipsterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tipster, loading, error, refreshTipster } = useTipsterDetail(id ?? '');
  const { updateTipster, deleteTipster } = useTipsters();

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error || !tipster) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="error" className="mb-6">
            {error || 'No se encontró el tipster'}
          </Alert>
          <Button variant="secondary" onClick={handleBack}>
            Volver a Tipsters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
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
                { id: 'follows', label: 'Seguimientos' },
                { id: 'historial', label: 'Historial' },
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
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-4">
                Estadísticas Generales
              </h2>
              <div className="text-slate-400 text-center py-12">
                <p>Estadísticas del tipster se mostrarán aquí</p>
                <p className="text-sm mt-2">
                  Se calcularán cuando se implementen las picks (Fase 5)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'my-stats' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-4">
                Comparación: Tipster vs Mis Follows
              </h2>
              <div className="text-slate-400 text-center py-12">
                <p>Comparación de estadísticas se mostrará aquí</p>
                <p className="text-sm mt-2">
                  Se calculará cuando se implementen los follows (Fase 6)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'follows' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-4">
                Picks Seguidas
              </h2>
              <div className="text-slate-400 text-center py-12">
                <p>Lista de picks seguidas se mostrará aquí</p>
                <p className="text-sm mt-2">
                  Se implementará en la Fase 6 (Feature Follows)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-4">
                Historial de Picks
              </h2>
              <div className="text-slate-400 text-center py-12">
                <p>Historial completo de picks se mostrará aquí</p>
                <p className="text-sm mt-2">
                  Se implementará en la Fase 5 (Feature Picks)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <AddTipsterModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          tipster={tipster}
          onUpdate={updateTipster}
        />
      </div>
    </div>
  );
}
