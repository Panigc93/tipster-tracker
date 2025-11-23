export interface CollapsibleSectionProps {
  /**
   * Title displayed in the header
   */
  title: string;

  /**
   * Content to be shown/hidden
   */
  children: React.ReactNode;

  /**
   * Whether the section should be open by default
   * If not provided, defaults to:
   * - false on mobile (< 768px)
   * - true on desktop (>= 768px)
   */
  defaultOpen?: boolean;

  /**
   * Optional badge number to display (e.g., active filter count)
   */
  badge?: number;

  /**
   * Optional icon to display before the title
   */
  icon?: React.ReactNode;

  /**
   * Optional actions to display in the header (e.g., clear button)
   */
  actions?: React.ReactNode;

  /**
   * Optional className for the container
   */
  className?: string;
}
