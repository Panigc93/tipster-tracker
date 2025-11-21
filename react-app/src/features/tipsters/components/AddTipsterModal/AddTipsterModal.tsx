import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Modal, Button, Input, Dropdown } from '@/shared/components/ui';
import { ALL_CHANNELS } from '@/shared/constants';
import { useAuth } from '@features/auth/hooks';
import type { AddTipsterModalProps, TipsterFormData } from './AddTipsterModal.types';

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
  const [formData, setFormData] = useState<TipsterFormData>({
    name: '',
    channel: '',
  });
  const [errors, setErrors] = useState<Partial<TipsterFormData>>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(tipster);

  // Initialize form with tipster data when editing
  useEffect(() => {
    if (tipster) {
      setFormData({
        name: tipster.name,
        channel: tipster.channel,
      });
    } else {
      setFormData({
        name: '',
        channel: '',
      });
    }
    setErrors({});
  }, [tipster, isOpen]);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar Tipster' : 'Añadir Tipster'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="tipster-name" className="block text-sm font-medium text-slate-200 mb-2">
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
          <label htmlFor="tipster-channel" className="block text-sm font-medium text-slate-200 mb-2">
            Canal <span className="text-red-400">*</span>
          </label>
          <Dropdown
            options={ALL_CHANNELS.map((channel) => ({
              value: channel,
              label: channel,
            }))}
            value={formData.channel}
            onChange={(value) => setFormData({ ...formData, channel: value as string })}
            placeholder="Selecciona un canal"
            disabled={loading}
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
    </Modal>
  );
}
