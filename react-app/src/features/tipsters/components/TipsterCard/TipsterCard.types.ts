import type { Tipster } from '../../types';

export interface TipsterCardProps {
  /** Tipster data to display */
  tipster: Tipster;

  /** Callback when card is clicked */
  onClick?: (tipsterId: string) => void;

  /** Optional statistics to display */
  stats?: {
    totalPicks: number;
    winrate: number;
    yield: number;
    totalProfit: number;
  };

  /** Additional CSS classes */
  className?: string;
}
