/**
 * Tabs component types
 */

export interface TabItem {
  /**
   * Unique key
   */
  key: string;

  /**
   * Tab label
   */
  label: string;

  /**
   * Tab icon (optional)
   */
  icon?: React.ReactNode;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface TabsProps {
  /**
   * Available tabs
   */
  tabs: TabItem[];

  /**
   * Active tab key
   */
  activeTab: string;

  /**
   * Callback when tab changes
   */
  onChange: (tabKey: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface TabPanelProps {
  /**
   * Tab key this panel belongs to
   */
  tabKey: string;

  /**
   * Currently active tab
   */
  activeTab: string;

  /**
   * Panel content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}
