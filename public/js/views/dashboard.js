/**
 * Módulo de vista para el dashboard
 * @fileoverview Módulo de vista para el dashboard
 * @module views/dashboard
 */

import { handleSignOut } from "../core/auth.js";
import { state } from "../core/state.js";
import { showAddPickModal } from "../modals/pick-modal.js";
import { showAddTipsterModal } from "../modals/tipster-modal.js";
import { calculateDashboardPersonalStats, calculateStats } from "../utils/calculations.js";
import { formatDate, getLastPickDate } from "../utils/date-utils.js";
import { filterTipsters, resetFilters } from "../utils/filters.js";

function renderDashboardPersonalStats() {
  const stats = calculateDashboardPersonalStats();
  
  document.getElementById('dashPersonalFollowed').textContent = stats.totalFollowed;
  document.getElementById('dashPersonalWinrate').textContent = stats.winrate + '%';
  
  const yieldEl = document.getElementById('dashPersonalYield');
  yieldEl.textContent = stats.yield + '%';
  yieldEl.style.color = parseFloat(stats.yield) >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  document.getElementById('dashPersonalAvgOdds').textContent = stats.avgOdds;
  document.getElementById('dashPersonalAvgStake').textContent = stats.avgStake;
  document.getElementById('dashPersonalFavBook').textContent = stats.favBook;
  document.getElementById('dashPersonalBestBook').textContent = stats.bestBook;
  
  const profitEl = document.getElementById('dashPersonalProfit');
  profitEl.textContent = stats.totalProfit + 'u';
  profitEl.style.color = parseFloat(stats.totalProfit) >= 0 ? 'var(--color-success)' : 'var(--color-error)';
}

function renderDashboard() {
  const container = document.getElementById('tipstersGrid');
  const emptyState = document.getElementById('emptyState');

  if (state.tipsters.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  const filteredTipsters = filterTipsters();
  
  if (filteredTipsters.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>No se encontraron tipsters</h3><p>Intenta ajustar los filtros</p></div>';
    return;
  }
  
  container.style.display = 'grid';
  emptyState.style.display = 'none';
  
  renderDashboardPersonalStats();
  
  container.innerHTML = filteredTipsters.map(tipster => {
    const stats = calculateStats(tipster.id);
    const lastPick = getLastPickDate(tipster.id);
    const lastPickStr = lastPick ? formatDate(lastPick.toISOString().split('T')[0]) : 'Sin picks';
    return `
      <div class="tipster-card" data-tipster-id="${tipster.id}">
        <div class="tipster-card-header">
          <div class="tipster-card-left">
            <div class="tipster-card-title">${tipster.name}</div>
            <span class="tipster-card-channel">${tipster.channel}</span>
          </div>
          <div class="tipster-card-right">
            <div class="tipster-card-date">Desde ${formatDate(tipster.createdDate)}</div>
            <div class="tipster-card-date">Último pick ${lastPickStr}</div>
          </div>
        </div>
        <div class="tipster-stats">
          <div class="stat-item">
            <div class="stat-label">Picks</div>
            <div class="stat-value">${stats.totalPicks}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Winrate</div>
            <div class="stat-value">${stats.winrate}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Yield</div>
            <div class="stat-value" style="color: ${parseFloat(stats.yield) >= 0 ? 'var(--color-success)' : 'var(--color-error)'}">${stats.yield}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Seguibilidad</div>
            <div class="stat-value" style="color: ${parseFloat(stats.traceability) >= 80 ? 'var(--color-success)' : parseFloat(stats.traceability) >= 50 ? 'var(--color-warning)' : 'var(--color-error)'}">${stats.traceability}%</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupDashboardListeners() {
    // Dashboard acciones
  document.getElementById('addTipsterBtn')?.addEventListener('click', showAddTipsterModal);
  document.getElementById('addPickBtn')?.addEventListener('click', showAddPickModal);
  document.getElementById('signOutBtn')?.addEventListener('click', handleSignOut);
  document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

  document.getElementById('navbarLogo').addEventListener('click', function() {
    showView('dashboard');
  });
}

export { renderDashboard, renderDashboardPersonalStats, setupDashboardListeners };