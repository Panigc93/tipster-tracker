import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import type { DropdownProps } from './Dropdown.types';

/**
 * Dropdown component with single/multi select and search
 *
 * @example
 * ```tsx
 * // Single select
 * <Dropdown
 *   options={[
 *     { value: 'football', label: 'Fútbol' },
 *     { value: 'basketball', label: 'Baloncesto' },
 *   ]}
 *   value={selected}
 *   onChange={(value) => setSelected(value as string)}
 * />
 *
 * // Multi select with search
 * <Dropdown
 *   mode="multi"
 *   searchable
 *   options={options}
 *   value={selected}
 *   onChange={(values) => setSelected(values as string[])}
 * />
 * ```
 */
export function Dropdown({
  options,
  value,
  onChange,
  mode = 'single',
  placeholder = 'Seleccionar...',
  searchable = false,
  searchPlaceholder = 'Buscar...',
  disabled = false,
  fullWidth = false,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options by search query
  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option(s) for display
  const selectedOptions = mode === 'single'
    ? options.filter((opt) => opt.value === value)
    : options.filter((opt) => (value as string[])?.includes(opt.value));

  const displayText =
    selectedOptions.length > 0
      ? mode === 'single'
        ? selectedOptions[0].label
        : `${selectedOptions.length} seleccionado${selectedOptions.length > 1 ? 's' : ''}`
      : placeholder;

  // Handle option click
  const handleOptionClick = (optionValue: string) => {
    if (mode === 'single') {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    } else {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    }
  };

  // Check if option is selected
  const isSelected = (optionValue: string): boolean => {
    if (mode === 'single') {
      return value === optionValue;
    }
    return ((value as string[]) || []).includes(optionValue);
  };

  // Clear all selections (multi mode only)
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-64'} ${className}`}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full px-4 py-2
          bg-slate-700 border border-slate-600 rounded-md
          text-sm text-slate-200
          transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <span 
          className={`flex-1 text-left truncate ${selectedOptions.length === 0 ? 'text-slate-400' : ''}`}
          title={displayText}
        >
          {displayText}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {mode === 'multi' && selectedOptions.length > 0 && !disabled && (
            <X
              className="h-4 w-4 text-slate-400 hover:text-slate-200"
              onClick={handleClearAll}
            />
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg animate-slide-down">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400 text-center">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleOptionClick(option.value)}
                    disabled={option.disabled}
                    className={`
                      flex items-center justify-between w-full px-3 py-2 rounded-md
                      text-sm transition-colors
                      ${option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-slate-700 cursor-pointer'
                      }
                      ${selected ? 'bg-blue-500/10 text-blue-400' : 'text-slate-200'}
                    `}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {option.icon && <span className="h-4 w-4 flex-shrink-0">{option.icon}</span>}
                      <span className="truncate" title={option.label}>{option.label}</span>
                    </div>
                    {selected && <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
