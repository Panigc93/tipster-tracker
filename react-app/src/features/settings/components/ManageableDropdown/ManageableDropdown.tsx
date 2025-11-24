/**
 * @fileoverview ManageableDropdown - Custom dropdown with add/edit functionality
 * @module features/settings/components/ManageableDropdown
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Pencil, Search } from 'lucide-react';
import { sortWithOtroLast } from '@features/settings/utils';
import type { SettingsCategory } from '@features/settings/types';

export interface ManageableDropdownProps {
  /** Label for the dropdown */
  label: string;
  
  /** Currently selected value */
  value: string;
  
  /** List of available items */
  items: string[];
  
  /** Category type (sport, bookmaker, channel) */
  category: SettingsCategory;
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Callback to open add modal */
  onAdd: () => void;
  
  /** Callback to open edit modal */
  onEdit: (item: string) => void;
  
  /** Optional placeholder */
  placeholder?: string;
  
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * Custom dropdown component with search, add, and edit functionality
 */
export function ManageableDropdown({
  label,
  value,
  items,
  category,
  onChange,
  onAdd,
  onEdit,
  placeholder = 'Seleccionar...',
  disabled = false,
}: ManageableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sort items with "Otro" at the end
  const sortedItems = sortWithOtroLast(items);

  // Filter items based on search query
  const filteredItems = searchQuery
    ? sortedItems.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedItems;

  // Show search if more than 10 items
  const showSearch = sortedItems.length > 10;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleEdit = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
    setIsOpen(false);
  };

  const handleAddClick = () => {
    onAdd();
    setIsOpen(false);
  };

  // Get display text for category
  const getCategoryText = () => {
    switch (category) {
      case 'sport':
        return 'deporte';
      case 'bookmaker':
        return 'casa de apuestas';
      case 'channel':
        return 'canal';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg
          text-left text-white
          flex items-center justify-between
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <span className={value ? 'text-white' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-96 overflow-hidden">
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-slate-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Buscar ${getCategoryText()}...`}
                  className="w-full pl-10 pr-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item}
                  className={`
                    px-4 py-2.5 cursor-pointer transition-colors
                    flex items-center justify-between group
                    ${item === value ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-600'}
                  `}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span>{item}</span>
                  
                  {/* Edit Button (show on hover) */}
                  {hoveredItem === item && item !== value && (
                    <button
                      onClick={(e) => handleEdit(item, e)}
                      className="p-1 rounded hover:bg-slate-500 transition-colors"
                      title={`Editar ${item}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-400">
                No se encontraron resultados
              </div>
            )}
          </div>

          {/* Add New Item Button */}
          <div className="border-t border-slate-600">
            <button
              type="button"
              onClick={handleAddClick}
              className="w-full px-4 py-3 text-left text-blue-400 hover:bg-slate-600 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir nuevo {getCategoryText()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
