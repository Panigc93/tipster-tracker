/**
 * @fileoverview AddItemModal - Modal for adding new items to settings
 * @module features/settings/components/AddItemModal
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import type { SettingsCategory } from '@features/settings/types';

export interface AddItemModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback when item is added */
  onAdd: (item: string) => Promise<void>;
  
  /** Category type */
  category: SettingsCategory;
  
  /** Existing items (for duplicate validation) */
  existingItems: string[];
}

/**
 * Modal for adding new items to user settings
 */
export function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  category,
  existingItems,
}: AddItemModalProps) {
  const [itemName, setItemName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Check duplicate (case-insensitive)
    const normalized = name.trim().toLowerCase();
    const duplicate = existingItems.find(
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

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd(itemName.trim());
      setItemName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al añadir');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItemName('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            Añadir {categoryText.singular}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre {categoryText.article} {categoryText.singular}
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setError(null);
              }}
              placeholder={`Ej: ${category === 'sport' ? 'Padel' : category === 'bookmaker' ? 'BET777' : 'WhatsApp'}`}
              className={`
                w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white
                placeholder-slate-400 focus:outline-none focus:ring-2
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'}
              `}
              autoFocus
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Info */}
          <div className="mb-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              ℹ️ {categoryText.article.charAt(0).toUpperCase() + categoryText.article.slice(1)} {categoryText.singular} se añadirá a tu lista personalizada
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
              {isSubmitting ? 'Añadiendo...' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
