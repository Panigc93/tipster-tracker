/**
 * TEMPORARY: Demo page for testing ManageableDropdown components
 * DELETE after integration is complete
 */

import { useState } from 'react';
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown, AddItemModal, EditItemModal } from '@features/settings/components';
import type { SettingsCategory } from '@features/settings/types';
import { toast } from 'sonner';

export function SettingsDemo() {
  const {
    settings,
    loading,
    addSport,
    updateSport,
    addBookmaker,
    updateBookmaker,
    addChannel,
    updateChannel,
  } = useSettings();

  // State for selected values
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedBookmaker, setSelectedBookmaker] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');

  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<SettingsCategory>('sport');
  const [itemToEdit, setItemToEdit] = useState('');

  if (loading) {
    return <div className="p-6 text-white">Loading settings...</div>;
  }

  // Handle add
  const handleAdd = (category: SettingsCategory) => {
    setCurrentCategory(category);
    setAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (category: SettingsCategory, item: string) => {
    setCurrentCategory(category);
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  // Add item
  const handleAddItem = async (item: string) => {
    try {
      switch (currentCategory) {
        case 'sport':
          await addSport(item);
          toast.success(`Deporte "${item}" añadido`);
          break;
        case 'bookmaker':
          await addBookmaker(item);
          toast.success(`Casa de apuestas "${item}" añadida`);
          break;
        case 'channel':
          await addChannel(item);
          toast.success(`Canal "${item}" añadido`);
          break;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error');
      throw error;
    }
  };

  // Edit item
  const handleEditItem = async (oldItem: string, newItem: string) => {
    try {
      switch (currentCategory) {
        case 'sport':
          await updateSport(oldItem, newItem);
          toast.success(`Deporte actualizado`);
          break;
        case 'bookmaker':
          await updateBookmaker(oldItem, newItem);
          toast.success(`Casa de apuestas actualizada`);
          break;
        case 'channel':
          await updateChannel(oldItem, newItem);
          toast.success(`Canal actualizado`);
          break;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error');
      throw error;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">
        🧪 Settings Components Demo
      </h1>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
        <p className="text-blue-300 text-sm">
          ⚠️ Esta es una página de demostración temporal. Será eliminada después de la integración.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sport Dropdown */}
        <div>
          <ManageableDropdown
            label="Deporte"
            value={selectedSport}
            items={settings?.sports || []}
            category="sport"
            onChange={setSelectedSport}
            onAdd={() => handleAdd('sport')}
            onEdit={(item) => handleEdit('sport', item)}
            placeholder="Selecciona un deporte"
          />
          {selectedSport && (
            <p className="mt-2 text-sm text-slate-400">
              Seleccionado: <span className="text-white">{selectedSport}</span>
            </p>
          )}
        </div>

        {/* Bookmaker Dropdown */}
        <div>
          <ManageableDropdown
            label="Casa de Apuestas"
            value={selectedBookmaker}
            items={settings?.bookmakers || []}
            category="bookmaker"
            onChange={setSelectedBookmaker}
            onAdd={() => handleAdd('bookmaker')}
            onEdit={(item) => handleEdit('bookmaker', item)}
            placeholder="Selecciona una casa"
          />
          {selectedBookmaker && (
            <p className="mt-2 text-sm text-slate-400">
              Seleccionado: <span className="text-white">{selectedBookmaker}</span>
            </p>
          )}
        </div>

        {/* Channel Dropdown */}
        <div>
          <ManageableDropdown
            label="Canal"
            value={selectedChannel}
            items={settings?.channels || []}
            category="channel"
            onChange={setSelectedChannel}
            onAdd={() => handleAdd('channel')}
            onEdit={(item) => handleEdit('channel', item)}
            placeholder="Selecciona un canal"
          />
          {selectedChannel && (
            <p className="mt-2 text-sm text-slate-400">
              Seleccionado: <span className="text-white">{selectedChannel}</span>
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 p-6 bg-slate-800 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Estadísticas</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {settings?.sports.length || 0}/60
            </p>
            <p className="text-sm text-slate-400">Deportes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {settings?.bookmakers.length || 0}/50
            </p>
            <p className="text-sm text-slate-400">Bookmakers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {settings?.channels.length || 0}/30
            </p>
            <p className="text-sm text-slate-400">Canales</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddItem}
        category={currentCategory}
        existingItems={
          currentCategory === 'sport'
            ? settings?.sports || []
            : currentCategory === 'bookmaker'
            ? settings?.bookmakers || []
            : settings?.channels || []
        }
      />

      <EditItemModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleEditItem}
        category={currentCategory}
        currentItem={itemToEdit}
        existingItems={
          currentCategory === 'sport'
            ? settings?.sports || []
            : currentCategory === 'bookmaker'
            ? settings?.bookmakers || []
            : settings?.channels || []
        }
      />
    </div>
  );
}
