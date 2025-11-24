/**
 * @fileoverview ManageableDropdown - Custom dropdown with add/edit functionality
 * @module features/settings/components/ManageableDropdown
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Search } from 'lucide-react';
import { sortWithOtroLast } from '@features/settings/utils';
import type { SettingsCategory } from '@features/settings/types';

export interface ManageableDropdownProps {
  label: string;
  value: string;
  items: string[];
  category: SettingsCategory;
  onChange: (value: string) => void;
  onAdd?: () => void;
  onEdit?: (item: string) => void;
  placeholder?: string;
  disabled?: boolean;
}


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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sortedItems = sortWithOtroLast(items);

  const filteredItems = searchQuery
    ? sortedItems.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedItems;

  const showSearch = sortedItems.length > 10;

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }

      const dropdownMenu = document.getElementById(`dropdown-menu-${label}`);
      if (dropdownMenu && dropdownMenu.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
      setSearchQuery('');
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, label]);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleEdit = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
      setIsOpen(false);
    }
  };

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
      setIsOpen(false);
    }
  };

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
    <div className="relative text-base" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full h-[35px] px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-md
          text-left
          flex items-center justify-between
          transition-colors
          hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen || value ? 'ring-1 ring-blue-500 border-blue-500' : ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '16px 16px',
        }}
      >
        <span className={value ? 'text-slate-100' : 'text-slate-500'}>
          {value || placeholder || `Seleccionar ${getCategoryText()}`}
        </span>
      </button>

      {isOpen && createPortal(
        <div 
          id={`dropdown-menu-${label}`}
          className="absolute z-[9999] bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {showSearch && (
            <div className="p-2 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Buscar ${getCategoryText()}...`}
                  className="w-full pl-6 pr-2 py-0 bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto text-base">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item}
                  className={`
                    px-4 py-1 cursor-pointer transition-colors
                    flex items-center justify-between group
                    ${item === value ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'}
                  `}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span>{item}</span>
                  
                  {hoveredItem === item && item !== value && onEdit && (
                    <button
                      onClick={(e) => handleEdit(item, e)}
                      className="p-1 rounded hover:bg-slate-700 transition-colors"
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

          {onAdd && (
            <div className="border-t border-slate-700 bg-slate-800 text-sm">
              <button
                type="button"
                onClick={handleAddClick}
                className="w-full px-4 py-1 text-left text-blue-400 hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Añadir {getCategoryText()}</span>
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
