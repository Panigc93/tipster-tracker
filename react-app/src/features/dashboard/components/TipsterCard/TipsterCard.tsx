/**
 * TipsterCard component
 * Displays a tipster with key statistics
 */

import { useNavigate } from 'react-router-dom';
import type { TipsterWithStats } from '../../utils/dashboard-filters.utils';

interface TipsterCardProps {
  readonly tipster: TipsterWithStats;
}

export function TipsterCard({ tipster }: Readonly<TipsterCardProps>) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tipsters/${tipster.id}`);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="w-full text-left bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
            {tipster.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{tipster.channel}</p>
        </div>
        <div className="text-3xl ml-2">🎯</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Total picks */}
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Picks</div>
          <div className="text-xl font-bold text-slate-100">{tipster.stats.totalPicks}</div>
        </div>

        {/* Winrate */}
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Winrate</div>
          <div className="text-xl font-bold text-slate-100">{tipster.stats.winrate.toFixed(1)}%</div>
        </div>

        {/* Yield */}
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Yield</div>
          <div
            className={`text-xl font-bold ${
              tipster.stats.yield >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {tipster.stats.yield.toFixed(1)}%
          </div>
        </div>

        {/* Traceability */}
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Seguibilidad</div>
          <div className="text-xl font-bold text-slate-100">{tipster.stats.traceability.toFixed(0)}%</div>
        </div>
      </div>

      {/* Footer - Last pick date */}
      {tipster.lastPickDate && (
        <div className="text-xs text-slate-500 pt-3 border-t border-slate-700">
          Último pick: {new Date(tipster.lastPickDate).toLocaleDateString('es-ES')}
        </div>
      )}
    </button>
  );
}
