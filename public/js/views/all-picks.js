/**
 * @fileoverview Módulo de vista para todos los picks
 * @module views/all-picks
 */

import { state } from "../core/state.js";
import { sportIcons } from "../data/constants.js";
import { calculatePickProfit } from "../utils/calculations.js";
import { formatDate } from "../utils/date-utils.js";

function renderAllPicks() {
  const tbody = document.getElementById('allPicksBody');
  
  if (state.picks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: var(--space-24);">No hay picks registrados</td></tr>';
    return;
  }

  const sortedPicks = [...state.picks].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  tbody.innerHTML = sortedPicks.map(pick => {
    const tipster = state.tipsters.find(t => t.id === pick.tipsterId);
    const profit = calculatePickProfit(pick);
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

export { renderAllPicks };