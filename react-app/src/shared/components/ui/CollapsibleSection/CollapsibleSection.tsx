import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CollapsibleSectionProps } from './CollapsibleSection.types';

export function CollapsibleSection({
  title,
  children,
  defaultOpen,
  badge,
  icon,
  actions,
  className = '',
}: CollapsibleSectionProps) {
  // Determine initial state based on screen size if defaultOpen not provided
  const [isOpen, setIsOpen] = useState(() => {
    if (defaultOpen !== undefined) {
      return defaultOpen;
    }
    // Default: collapsed on mobile, expanded on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Handle window resize to update default state
  useEffect(() => {
    if (defaultOpen !== undefined) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsOpen(!isMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={toggleOpen}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="collapsible-content"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-400">{icon}</span>}
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      <div
        id="collapsible-content"
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
