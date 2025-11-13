/**
 * @fileoverview Módulo de utilidades para filtros en el dashboard
 * @module utils/filters
 */

import { state } from "../core/state.js";
import { allChannels, allSports } from "../data/constants.js";
import { renderDashboard, renderDashboardPersonalStats } from "../views/dashboard.js";
import { calculatePickProfit, calculateStats } from "./calculations.js";
import { formatDate, getLastPickDate } from "./date-utils.js";
import { updateDropdownText } from "./ui-helpers.js";

function filterTipsters() {
  let filtered = [...state.tipsters];
  
  if (state.dashboardFilters.searchQuery) {
    filtered = filtered.filter(t => t.name.toLowerCase().includes(state.dashboardFilters.searchQuery));
  }
  
  if (state.dashboardFilters.sports.length > 0) {
    filtered = filtered.filter(t => {
      const tipsterPicks = state.picks.filter(p => p.tipsterId === t.id);
      const tipsterSports = [...new Set(tipsterPicks.map(p => p.sport))];
      return state.dashboardFilters.sports.some(sport => tipsterSports.includes(sport));
    });
  }
  
  if (state.dashboardFilters.channels.length > 0) {
    filtered = filtered.filter(t => state.dashboardFilters.channels.includes(t.channel));
  }

  if (state.dashboardFilters.yieldMin !== null) {
    filtered = filtered.filter(t => {
      const stats = calculateStats(t.id);
      const yield_ = parseFloat(stats.yield);
      return yield_ >= state.dashboardFilters.yieldMin;
    });
  }

  if (state.dashboardFilters.lastPickDays !== 'all') {
    const days = parseInt(state.dashboardFilters.lastPickDays);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    filtered = filtered.filter(t => {
      const lastPick = getLastPickDate(t.id);
      return lastPick && lastPick >= cutoffDate;
    });
  }
  
  filtered.sort((a, b) => {
    if (state.dashboardFilters.sortBy === 'yield') {
      const yieldA = parseFloat(calculateStats(a.id).yield);
      const yieldB = parseFloat(calculateStats(b.id).yield);
      return yieldB - yieldA;
    } else if (state.dashboardFilters.sortBy === 'winrate') {
      const wrA = parseFloat(calculateStats(a.id).winrate);
      const wrB = parseFloat(calculateStats(b.id).winrate);
      return wrB - wrA;
    } else if (state.dashboardFilters.sortBy === 'lastPick') {
      const dateA = getLastPickDate(a.id) || new Date(0);
      const dateB = getLastPickDate(b.id) || new Date(0);
      return dateB - dateA;
    }
    return 0;
  });
  
  return filtered;
}

function filterPicks() {
  const tipsterFilter = document.getElementById('filterTipster').value;
  const sportFilter = document.getElementById('filterSport').value;
  const statusFilter = document.getElementById('filterStatus').value;
  const channelFilter = document.getElementById('filterChannel').value;
  const bookmakerFilter = document.getElementById('filterBookmaker').value;
  const resultFilter = document.getElementById('filterResult').value;
  
  let filteredPicks = [...state.picks];
  
  if (tipsterFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => p.tipsterId === parseInt(tipsterFilter));
  }
  
  if (sportFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => p.sport === sportFilter);
  }
  
  if (statusFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => (p.status || 'No Seguido') === statusFilter);
  }
  
  if (channelFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => {
      const tipster = state.tipsters.find(t => t.id === p.tipsterId);
      return tipster && tipster.channel === channelFilter;
    });
  }
  
  if (bookmakerFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => {
      const follow = state.userFollows.find(f => f.pickId === p.id);
      return follow && follow.userBookmaker === bookmakerFilter;
    });
  }
  
  if (resultFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => p.result === resultFilter);
  }
  
  const tbody = document.getElementById('allPicksBody');
  const sortedPicks = filteredPicks.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedPicks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: var(--space-24);">No se encontraron picks con los filtros seleccionados</td></tr>';
    return;
  }
  
  tbody.innerHTML = sortedPicks.map(pick => {
    const tipster = state.tipsters.find(t => t.id === pick.tipsterId);
    const profit = calculatePickProfit(pick);
    const isFollowed = state.userFollows.some(f => f.pickId === pick.id);
    
    const status = pick.status || 'No Seguido';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    const sportIcon = sportIcons[pick.sport] || '🎯';
    const displayType = pick.pickType === 'Pre' ? 'Pre' : pick.pickType;
    
    return `
      <tr data-pick-id="${pick.id}">
        <td>${formatDate(pick.date)}</td>
        <td>${tipster ? tipster.name : 'N/A'}</td>
        <td>${pick.match}</td>
        <td>${sportIcon} ${pick.sport}</td>
        <td>${displayType}</td>
        <td>${pick.betType || 'N/A'}</td>
        <td>${pick.odds.toFixed(2)}</td>
        <td>${pick.stake}</td>
        <td>
          <span class="status-badge ${statusClass} status-badge-clickable">${status}</span>
        </td>
        <td><span class="result-badge ${pick.result.toLowerCase()}">${pick.result}</span></td>
        <td><span class="profit ${profit >= 0 ? 'positive' : 'negative'}">${profit > 0 ? '+' : ''}${profit.toFixed(2)}u</span></td>
        <td>
          <button class="action-btn edit-pick-btn">Editar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterFollowedPicks() {
  const tipsterFilter = document.getElementById('followFilterTipster').value;
  const resultFilter = document.getElementById('followFilterResult').value;
  const matchFilter = document.getElementById('followFilterMatch').value;
  
  let filtered = [...state.userFollows];
  
  if (tipsterFilter !== 'all') {
    filtered = filtered.filter(f => f.tipsterId === parseInt(tipsterFilter));
  }
  
  if (resultFilter !== 'all') {
    filtered = filtered.filter(f => f.userResult === resultFilter);
  }
  
  if (matchFilter === 'match') {
    filtered = filtered.filter(f => {
      const pick = state.picks.find(p => p.id === f.pickId);
      return pick && f.userResult === pick.result;
    });
  } else if (matchFilter === 'diverge') {
    filtered = filtered.filter(f => {
      const pick = state.picks.find(p => p.id === f.pickId);
      return pick && f.userResult !== pick.result && f.isResolved;
    });
  }
  
  const tbody = document.getElementById('followedPicksBody');
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: var(--space-24);">No hay picks seguidos</td></tr>';
    return;
  }
  
  const sortedFollows = filtered.sort((a, b) => new Date(b.dateFollowed) - new Date(a.dateFollowed));
  
  tbody.innerHTML = sortedFollows.map(follow => {
    const pick = state.picks.find(p => p.id === follow.pickId);
    const tipster = state.tipsters.find(t => t.id === follow.tipsterId);

    const match = pick && follow.userResult === pick.result;
    const diverge = pick && follow.userResult !== pick.result && follow.isResolved;
    
    let matchIndicator = '<span class="match-indicator pending">?</span>';
    if (match) matchIndicator = '<span class="match-indicator match">✓</span>';
    else if (diverge) matchIndicator = '<span class="match-indicator diverge">✗</span>';
    
    return `
      <tr style="${match ? 'background: rgba(var(--color-success-rgb), 0.05);' : diverge ? 'background: rgba(var(--color-warning-rgb), 0.05);' : ''}">
        <td>${formatDate(follow.dateFollowed)}</td>
        <td>${tipster ? tipster.name : 'N/A'}</td>
        <td>${pick ? pick.match : 'N/A'}</td>
        <td>${follow.userBetType}</td>
        <td>${pick ? pick.odds.toFixed(2) : 'N/A'}</td>
        <td>${follow.userOdds.toFixed(2)}</td>
        <td>${pick ? pick.stake : 'N/A'}</td>
        <td>${follow.userStake}</td>
        <td>${follow.userBookmaker}</td>
        <td><span class="result-badge ${pick ? pick.result.toLowerCase() : 'pending'}">${pick ? pick.result : 'N/A'}</span></td>
        <td><span class="result-badge ${follow.userResult.toLowerCase()}">${follow.userResult}</span></td>
        <td><span class="profit ${follow.profitFromFollow >= 0 ? 'positive' : 'negative'}">${follow.profitFromFollow > 0 ? '+' : ''}${follow.profitFromFollow.toFixed(2)}u</span></td>
        <td>${matchIndicator}</td>
      </tr>
    `;
  }).join('');
}

function initializeFilters() {
  const sports = allSports;
  const channels = allChannels;
  
  const sportDropdown = document.getElementById('sportDropdown');
  sportDropdown.innerHTML = sports.map(sport => `
    <div class="dropdown-item">
      <input type="checkbox" value="${sport}" id="sport_${sport.replace(/\s+/g, '_')}">
      <label for="sport_${sport.replace(/\s+/g, '_')}">${sport}</label>
    </div>
  `).join('');

  const channelDropdown = document.getElementById('channelDropdown');
  channelDropdown.innerHTML = channels.map(channel => `
    <div class="dropdown-item">
      <input type="checkbox" value="${channel}" id="channel_${channel.replace(/\s+/g, '_').replace('/', '_')}">
      <label for="channel_${channel.replace(/\s+/g, '_').replace('/', '_')}">${channel}</label>
    </div>
  `).join('');
  
  const yieldInput = document.getElementById('yieldMinInput');
  yieldInput.value = -1000;
  yieldInput.addEventListener('input', function() {
    clearTimeout(state.yieldDebounceTimer);
    state.yieldDebounceTimer = setTimeout(() => {
      applyFilters();
    }, 500);
  });
  
  document.getElementById('lastPickFilter').addEventListener('change', applyFilters);
  document.getElementById('sortBy').addEventListener('change', applyFilters);
}

function updateDashboardFilters() {
  const sportCheckboxes = document.querySelectorAll('#sportDropdown input:checked');
  state.dashboardFilters.sports = Array.from(sportCheckboxes).map(cb => cb.value);
  
  const channelCheckboxes = document.querySelectorAll('#channelDropdown input:checked');
  state.dashboardFilters.channels = Array.from(channelCheckboxes).map(cb => cb.value);
  
  const yieldInput = document.getElementById('yieldMinInput');
  state.dashboardFilters.yieldMin = parseFloat(yieldInput.value) || -1000;

  state.dashboardFilters.lastPickDays = document.getElementById('lastPickFilter').value;

  state.dashboardFilters.sortBy = document.getElementById('sortBy').value;

  const searchInput = document.getElementById('tipsterSearch');
  state.dashboardFilters.searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const clearBtn = document.querySelector('.clear-search');
  if (clearBtn) {
    clearBtn.style.display = state.dashboardFilters.searchQuery ? 'inline-flex' : 'none';
  }
}

function applyFilters() {
  updateDashboardFilters();
  renderDashboard();
  renderDashboardPersonalStats();
}

function resetFilters() {
  document.querySelectorAll('#sportDropdown input').forEach(cb => cb.checked = false);
  document.querySelectorAll('#channelDropdown input').forEach(cb => cb.checked = false);
  updateDropdownText();
  
  document.getElementById('yieldMinInput').value = -1000;
  document.getElementById('lastPickFilter').value = 'all';
  document.getElementById('sortBy').value = 'yield';
  document.getElementById('tipsterSearch').value = '';
  
  state.dashboardFilters = {
    sports: [],
    channels: [],
    yieldMin: -1000,
    lastPickDays: 'all',
    sortBy: 'yield',
    searchQuery: ''
  };
  renderDashboard();
  renderDashboardPersonalStats();
}

export { filterTipsters, filterPicks, filterFollowedPicks, initializeFilters, applyFilters, resetFilters };