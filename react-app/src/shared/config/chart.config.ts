/**
 * Chart.js registration and configuration
 * Registers all necessary components for Chart.js to work with React
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// Default font configuration
ChartJS.defaults.font.family = "'FKGroteskNeue', 'Geist', 'Inter', sans-serif";
ChartJS.defaults.color = '#E0E0E0'; // slate-300
