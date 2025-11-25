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
      className="w-full text-left bg-slate-800 rounded-md p-5 border border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
            {tipster.name}
          </h3>
          <p className="text-sm text-slate-100 mt-1 bg-blue-500 rounded-full px-2 w-fit">{tipster.channel}</p>
        </div>
        <div className="text-xs text-gray-400">
          <div>
            <p> Desde {new Date(tipster.createdDate).toLocaleDateString('es-ES')}</p>
          </div>
          <div>{tipster?.stats?.lastPickDate ? (
            <p>Último pick: {new Date(tipster?.stats?.lastPickDate).toLocaleDateString('es-ES')}</p>
          ) : (
            <p>Último pick: Sin picks</p>
          )}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1">
        <div className="bg-blue-700 bg-opacity-20 rounded-sm p-3">
          <div className="text-xs text-slate-400 mb-1">Picks</div>
          <div className="text-lg font-bold text-slate-100">{tipster.stats.totalPicks}</div>
        </div>

        <div className="bg-blue-700 bg-opacity-20 rounded-sm p-3">
          <div className="text-xs text-slate-400 mb-1">Winrate</div>
          <div className="text-lg font-bold text-slate-100">{tipster.stats.winrate.toFixed(1)}%</div>
        </div>

        <div className="bg-blue-700 bg-opacity-20 rounded-sm p-3">
          <div className="text-xs text-slate-400 mb-1">Yield</div>
          <div
            className={`text-lg font-bold ${
              tipster.stats.yield > 0 ? 'text-green-400' : tipster.stats.yield === 0 ? 'text-slate-100' : 'text-red-400'
            }`}
          >
            {tipster.stats.yield.toFixed(1)}%
          </div>
        </div>

        <div className="bg-blue-700 bg-opacity-20 rounded-sm p-3">
          <div className="text-xs text-slate-400 mb-1">Seguibilidad</div>
          <div className="text-lg font-bold text-slate-100">{tipster.stats.traceability.toFixed(0)}%</div>
        </div>
      </div>
    </button>
  );
}
