import { useEffect, useRef } from 'react';
import type { TabsProps, TabPanelProps } from './Tabs.types';

/**
 * Tabs component for navigation between views
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { key: 'profile', label: 'Perfil' },
 *   { key: 'settings', label: 'Ajustes' },
 * ];
 *
 * <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
 * <TabPanel tabKey="profile" activeTab={activeTab}>
 *   <ProfileContent />
 * </TabPanel>
 * <TabPanel tabKey="settings" activeTab={activeTab}>
 *   <SettingsContent />
 * </TabPanel>
 * ```
 */
export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else if (e.key === 'ArrowRight') {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      } else {
        return;
      }

      // Skip disabled tabs
      while (tabs[nextIndex]?.disabled) {
        if (e.key === 'ArrowLeft') {
          nextIndex = nextIndex > 0 ? nextIndex - 1 : tabs.length - 1;
        } else {
          nextIndex = nextIndex < tabs.length - 1 ? nextIndex + 1 : 0;
        }
        if (nextIndex === currentIndex) break; // All tabs disabled
      }

      const nextTab = tabs[nextIndex];
      if (nextTab && !nextTab.disabled) {
        onChange(nextTab.key);
        tabRefs.current[nextTab.key]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs, onChange]);

  return (
    <div className={`border-b border-slate-700 ${className}`} role="tablist">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isDisabled = tab.disabled || false;

          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium
                border-b-2 transition-all whitespace-nowrap
                ${isActive
                  ? 'border-blue-500 text-blue-400'
                  : isDisabled
                    ? 'border-transparent text-slate-600 cursor-not-allowed'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              `}
            >
              {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TabPanel component - renders content for a specific tab
 */
export function TabPanel({ tabKey, activeTab, children, className = '' }: TabPanelProps) {
  if (tabKey !== activeTab) return null;

  return (
    <div
      id={`tabpanel-${tabKey}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabKey}`}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}
