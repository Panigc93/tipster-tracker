import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Modal, Button, Input } from '@/shared/components/ui';
import { useAuth } from '@features/auth/hooks';
import type { AddTipsterModalProps, TipsterFormData } from './AddTipsterModal.types';
import { useSettings } from '@features/settings/hooks';
import { ManageableDropdown, AddItemModal, EditItemModal } from '@features/settings/components';

/**
 * AddTipsterModal component
 * Modal for creating or editing a tipster
 *
 * @example
 * ```tsx
 * <AddTipsterModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSuccess={() => { refetch(); setIsOpen(false); }}
 *   onCreate={createTipster}
 * />
 * ```
 */
export function AddTipsterModal({
  isOpen,
  onClose,
  onSuccess,
  tipster,
  onCreate,
  onUpdate,
}: Readonly<AddTipsterModalProps>) {
  const { user } = useAuth();
  const { settings, addChannel, updateChannel, ensureChannelExists } = useSettings();
  
  const [formData, setFormData] = useState<TipsterFormData>({
    name: '',
    channel: '',
  });
  const [errors, setErrors] = useState<Partial<TipsterFormData>>({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState('');

  const isEditMode = Boolean(tipster);

  // Initialize form with tipster data when editing
  useEffect(() => {
    if (tipster) {
      setFormData({
        name: tipster.name,
        channel: tipster.channel,
      });
      // Ensure channel exists in settings
      if (tipster.channel) ensureChannelExists(tipster.channel);
    } else {
      setFormData({
        name: '',
        channel: '',
      });
    }
    setErrors({});
  }, [tipster, isOpen, ensureChannelExists]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TipsterFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.channel) {
      newErrors.channel = 'El canal es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      toast.error('Usuario no autenticado');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && tipster && onUpdate) {
        // Update existing tipster
        await onUpdate(tipster.id, {
          name: formData.name.trim(),
          channel: formData.channel,
        });
        toast.success('Tipster actualizado correctamente');
      } else if (onCreate) {
        // Create new tipster
        const today = new Date().toISOString().split('T')[0];
        await onCreate({
          uid: user.uid,
          name: formData.name.trim(),
          channel: formData.channel,
          createdDate: today,
        });
        toast.success('Tipster creado correctamente');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving tipster:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al guardar el tipster'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', channel: '' });
      setErrors({});
      onClose();
    }
  };

  const handleAddItem = async (item: string) => {
    await addChannel(item);
  };

  const handleEditItem = async (oldItem: string, newItem: string) => {
    await updateChannel(oldItem, newItem);
  };

  const handleOpenEdit = (item: string) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar Tipster' : 'Añadir Tipster'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Input */}
        <div>
          <label htmlFor="tipster-name" className="block text-sm font-medium text-slate-200 mb-1">
            Nombre <span className="text-red-400">*</span>
          </label>
          <Input
            id="tipster-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: ProTipster, BetMaster..."
            error={errors.name}
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Channel Dropdown */}
        <div>
          <ManageableDropdown
            label="Canal"
            value={formData.channel}
            items={settings?.channels || []}
            category="channel"
            onChange={(value) => setFormData({ ...formData, channel: value })}
            onAdd={() => setAddModalOpen(true)}
            onEdit={handleOpenEdit}
            disabled={loading}
            placeholder="Selecciona un canal"
          />
          {errors.channel && (
            <p className="mt-1 text-sm text-red-400">{errors.channel}</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditMode ? 'Guardar cambios' : 'Crear tipster'}
          </Button>
        </div>
      </form>

      <AddItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddItem}
        category="channel"
        existingItems={settings?.channels || []}
      />

      <EditItemModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleEditItem}
        category="channel"
        currentItem={itemToEdit}
        existingItems={settings?.channels || []}
      />
    </Modal>
  );
}
