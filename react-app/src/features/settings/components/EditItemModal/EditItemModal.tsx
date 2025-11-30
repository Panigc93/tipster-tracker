/**
 * @fileoverview EditItemModal - Modal for editing existing items in settings
 * @module features/settings/components/EditItemModal
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SettingsCategory } from '@features/settings/types';

export interface EditItemModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback when item is edited */
  onEdit: (oldItem: string, newItem: string) => Promise<void>;
  
  /** Category type */
  category: SettingsCategory;
  
  /** Current item being edited */
  currentItem: string;
  
  /** Existing items (for duplicate validation) */
  existingItems: string[];
}

/**
 * Modal for editing existing items in user settings
 */
export function EditItemModal({
  isOpen,
  onClose,
  onEdit,
  category,
  currentItem,
  existingItems,
}: EditItemModalProps) {
  const [itemName, setItemName] = useState(currentItem);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update item name when currentItem changes
  useEffect(() => {
    setItemName(currentItem);
  }, [currentItem]);

  if (!isOpen) return null;

  // Get category text
  const getCategoryText = () => {
    switch (category) {
      case 'sport':
        return { singular: 'deporte', article: 'el' };
      case 'bookmaker':
        return { singular: 'casa de apuestas', article: 'la' };
      case 'channel':
        return { singular: 'canal', article: 'el' };
    }
  };

  const categoryText = getCategoryText();

  // Validate item name
  const validateItem = (name: string): string | null => {
    if (!name.trim()) {
      return 'El nombre no puede estar vacío';
    }

    // If name hasn't changed, it's valid
    if (name.trim() === currentItem) {
      return null;
    }

    // Check duplicate (case-insensitive, excluding current item)
    const normalized = name.trim().toLowerCase();
    const otherItems = existingItems.filter((item) => item !== currentItem);
    const duplicate = otherItems.find(
      (item) => item.toLowerCase() === normalized
    );

    if (duplicate) {
      return `${categoryText.article} ${categoryText.singular} "${name}" ya existe como "${duplicate}"`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateItem(itemName);
    if (validationError) {
      setError(validationError);
      return;
    }

    // If name hasn't changed, just close
    if (itemName.trim() === currentItem) {
      handleClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onEdit(currentItem, itemName.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al editar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItemName(currentItem);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            Editar {categoryText.singular}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className=" mb-3">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre {categoryText.article} {categoryText.singular}
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setError(null);
              }}
              className={`
                w-full h-[35px] px-3 py-2 bg-slate-900 border rounded-md text-slate-200
                placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-700'}
              `}
              autoFocus
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Warning */}
          <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              ⚠️ Esto actualizará el nombre en tu lista personalizada
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !itemName.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
