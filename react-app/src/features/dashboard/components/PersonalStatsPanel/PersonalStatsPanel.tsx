/**
 * PersonalStatsPanel component
 * Displays user's global statistics in 8 stat cards
 */

import { useDashboardStats } from '../../hooks';

export function PersonalStatsPanel() {
  const stats = useDashboardStats();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Tus Estadísticas Generales</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* Picks Seguidos */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Picks Seguidos</div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalFollowed}</div>
        </div>

        {/* Winrate */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Winrate</div>
          <div className="text-2xl font-bold text-slate-100">{stats.winrate.toFixed(2)}%</div>
        </div>

        {/* Yield */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Yield</div>
          <div
            className={`text-2xl font-bold ${
              stats.yield >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stats.yield.toFixed(2)}%
          </div>
        </div>

        {/* Cuota Media */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Cuota Media</div>
          <div className="text-2xl font-bold text-slate-100">{stats.avgOdds.toFixed(2)}</div>
        </div>

        {/* Stake Medio */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Stake Medio</div>
          <div className="text-2xl font-bold text-slate-100">{stats.avgStake.toFixed(2)}</div>
        </div>

        {/* Casa Favorita */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Casa Favorita</div>
          <div className="text-lg font-bold text-slate-100 truncate" title={stats.favoriteBookmaker}>
            {stats.favoriteBookmaker}
          </div>
        </div>

        {/* Mejor Casa */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Mejor Casa</div>
          <div className="text-lg font-bold text-slate-100 truncate" title={stats.bestBookmaker}>
            {stats.bestBookmaker}
          </div>
        </div>

        {/* Beneficio Total */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Beneficio Total</div>
          <div
            className={`text-2xl font-bold ${
              stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stats.totalProfit.toFixed(2)}u
          </div>
        </div>
      </div>
    </div>
  );
}
