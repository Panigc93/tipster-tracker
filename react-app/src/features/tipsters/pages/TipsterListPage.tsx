import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button, Input, Spinner, Alert } from '@/shared/components/ui';
import { useTipsters } from '../hooks';
import { TipsterCard, AddTipsterModal } from '../components';
import type { CreateTipsterDto } from '../types';

/**
 * TipsterList page
 * Main page for displaying all tipsters in a grid
 */
export function TipsterListPage() {
  const navigate = useNavigate();
  const { tipsters, loading, error, createTipster, refreshTipsters } =
    useTipsters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Filter tipsters
  const filteredTipsters = tipsters.filter((tipster) => {
    const matchesSearch = tipster.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesChannel =
      selectedChannel === 'all' || tipster.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  // Get unique channels for filter
  const channels = ['all', ...new Set(tipsters.map((t) => t.channel))];

  const handleTipsterClick = (tipsterId: string) => {
    navigate(`/tipsters/${tipsterId}`);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    void refreshTipsters();
  };

  const handleCreate = async (data: CreateTipsterDto): Promise<void> => {
    await createTipster(data);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-200 mb-2">
                Mis Tipsters
              </h1>
              <p className="text-slate-400">
                {filteredTipsters.length} tipster
                {filteredTipsters.length === 1 ? '' : 's'} encontrado
                {filteredTipsters.length === 1 ? '' : 's'}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Añadir Tipster
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar tipster por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Channel Filter */}
            <div className="w-full sm:w-48">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los canales</option>
                {channels
                  .filter((c) => c !== 'all')
                  .map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTipsters.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                {searchQuery || selectedChannel !== 'all'
                  ? 'No se encontraron tipsters'
                  : 'No hay tipsters registrados'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || selectedChannel !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza añadiendo tu primer tipster'}
              </p>
              {!searchQuery && selectedChannel === 'all' && (
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Añadir Tipster
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tipsters Grid */}
        {!loading && filteredTipsters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTipsters.map((tipster) => (
              <TipsterCard
                key={tipster.id}
                tipster={tipster}
                onClick={handleTipsterClick}
              />
            ))}
          </div>
        )}

        {/* Add Tipster Modal */}
        <AddTipsterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
