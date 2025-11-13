/**
 * Módulo de vista para el detalle de un tipster
 * @fileoverview Módulo de vista para el detalle de un tipster
 * @module views/tipster-detail
 */

import { state } from "../core/state.js";
import { sportIcons } from "../data/constants.js";
import { calculatePickProfit, calculateStats } from "../utils/calculations.js";
import { formatDate } from "../utils/date-utils.js";
import { renderCharts } from "./charts.js";

function renderTipsterDetail(tipsterId) {
  const tipster = state.tipsters.find(t => t.id === tipsterId);
  if (!tipster) return;
  
  const stats = calculateStats(tipsterId);
  const tipsterPicks = state.picks.filter(p => p.tipsterId === tipsterId).sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById('tipsterDetailName').textContent = tipster.name;
  
  document.getElementById('detailTotalPicks').textContent = stats.totalPicks;
  document.getElementById('detailWinrate').textContent = stats.winrate + '%';
  
  const yieldEl = document.getElementById('detailYield');
  yieldEl.textContent = stats.yield + '%';
  yieldEl.style.color = parseFloat(stats.yield) >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  document.getElementById('detailAvgOdds').textContent = stats.avgOdds;
  document.getElementById('detailAvgStake').textContent = stats.avgStake;
  
  const profitEl = document.getElementById('detailTotalProfit');
  profitEl.textContent = stats.totalProfit + 'u';
  profitEl.style.color = parseFloat(stats.totalProfit) >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  const traceabilityEl = document.getElementById('detailTraceability');
  traceabilityEl.textContent = stats.traceability + '%';
  traceabilityEl.style.color = parseFloat(stats.traceability) >= 80 ? 'var(--color-success)' : parseFloat(stats.traceability) >= 50 ? 'var(--color-warning)' : 'var(--color-error)';
  
  renderCharts(stats);
  
  const tbody = document.getElementById('detailPicksBody');
  if (tipsterPicks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: var(--space-24);">No hay picks registrados para este tipster</td></tr>';
  } else {
    tbody.innerHTML = tipsterPicks.map(pick => {
      const profit = calculatePickProfit(pick);
      const isFollowed = state.userFollows.some(f => f.pickId === pick.id);
      const status = pick.status || 'No Seguido';
      const statusClass = status.toLowerCase().replace(/\s+/g, '-');
      const sportIcon = sportIcons[pick.sport] || '🎯';
      const displayType = pick.pickType === 'Pre' ? 'Pre' : pick.pickType;
      return `
        <tr data-pick-id="${pick.id}">
          <td>${formatDate(pick.date)}</td>
          <td>${pick.match}</td>
          <td>${sportIcon} ${pick.sport}</td>
          <td>${displayType}</td>
          <td>${pick.betType || 'N/A'}</td>
          <td>${pick.odds.toFixed(2)}</td>
          <td>${pick.stake}</td>
          <td><span class="result-badge ${pick.result.toLowerCase()}">${pick.result}</span></td>
          <td><span class="profit ${profit >= 0 ? 'positive' : 'negative'}">${profit > 0 ? '+' : ''}${profit.toFixed(2)}u</span></td>
          <td>
            <span class="status-badge ${statusClass} status-badge-clickable">${status}</span>
          </td>
          <td>
            <button class="action-btn edit-pick-btn">Editar</button>
            ${!isFollowed ? `<button class="action-btn follow-pick-btn" style="margin-left: 4px;">Seguir</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }
}

function renderTipsterFollows(tipsterId) {
  const tipsterFollows = state.userFollows.filter(f => f.tipsterId === tipsterId);
  const tbody = document.getElementById('tipsterFollowsBody');
  
  if (tipsterFollows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: var(--space-24);">No has seguido picks de este tipster</td></tr>';
    return;
  }
  
  const sortedFollows = tipsterFollows.sort((a, b) => new Date(b.dateFollowed) - new Date(a.dateFollowed));
  
  tbody.innerHTML = sortedFollows.map(follow => {
    const pick = state.picks.find(p => p.id === follow.pickId);
    
    return `
      <tr>
        <td>${formatDate(follow.dateFollowed)}</td>
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
      </tr>
    `;
  }).join('');
}

function renderFollowComparison(tipsterId) {
  const tipsterFollows = state.userFollows.filter(f => f.tipsterId === tipsterId && f.isResolved && f.userResult !== 'Void');
  
  if (tipsterFollows.length === 0) {
    document.getElementById('comparisonSection').style.display = 'none';
    return;
  }
  
  const followedPickIds = tipsterFollows.map(f => f.pickId);
  const followedPicks = state.picks.filter(p => followedPickIds.includes(p.id) && p.isResolved && p.result !== 'Void');
  
  const tipsterWon = followedPicks.filter(p => p.result === 'Ganada').length;
  const tipsterWinrate = followedPicks.length > 0 ? (tipsterWon / followedPicks.length * 100).toFixed(2) : 0;
  
  let tipsterStaked = 0;
  let tipsterProfit = 0;
  followedPicks.forEach(p => {
    tipsterStaked += p.stake;
    if (p.result === 'Ganada') {
      tipsterProfit += (p.odds - 1) * p.stake;
    } else if (p.result === 'Perdida') {
      tipsterProfit -= p.stake;
    }
  });
  const tipsterYield = tipsterStaked > 0 ? (tipsterProfit / tipsterStaked * 100).toFixed(2) : 0;
  const tipsterAvgOdds = followedPicks.length > 0 ? (followedPicks.reduce((sum, p) => sum + p.odds, 0) / followedPicks.length).toFixed(2) : 0;
  
  const myWon = tipsterFollows.filter(f => f.userResult === 'Ganada').length;
  const myWinrate = tipsterFollows.length > 0 ? (myWon / tipsterFollows.length * 100).toFixed(2) : 0;
  
  let myStaked = 0;
  let myProfit = 0;
  tipsterFollows.forEach(f => {
    myStaked += f.userStake;
    myProfit += f.profitFromFollow;
  });
  const myYield = myStaked > 0 ? (myProfit / myStaked * 100).toFixed(2) : 0;
  const myAvgOdds = tipsterFollows.length > 0 ? (tipsterFollows.reduce((sum, f) => sum + f.userOdds, 0) / tipsterFollows.length).toFixed(2) : 0;
  
  let matchCount = 0;
  tipsterFollows.forEach(f => {
    const pick = followedPicks.find(p => p.id === f.pickId);
    if (pick && f.userResult === pick.result) matchCount++;
  });
  const matchRate = tipsterFollows.length > 0 ? (matchCount / tipsterFollows.length * 100).toFixed(2) : 0;
  
  const bookmakers = {};
  tipsterFollows.forEach(f => {
    bookmakers[f.userBookmaker] = (bookmakers[f.userBookmaker] || 0) + 1;
  });
  const mostUsedBook = Object.keys(bookmakers).length > 0 ? Object.keys(bookmakers).reduce((a, b) => bookmakers[a] > bookmakers[b] ? a : b) : '-';
  
  document.getElementById('compTipsterWinrate').textContent = tipsterWinrate + '%';
  document.getElementById('compTipsterYield').textContent = tipsterYield + '%';
  document.getElementById('compTipsterAvgOdds').textContent = tipsterAvgOdds;
  
  document.getElementById('compMyWinrate').textContent = myWinrate + '%';
  document.getElementById('compMyYield').textContent = myYield + '%';
  document.getElementById('compMyAvgOdds').textContent = myAvgOdds;
  
  document.getElementById('compFollowCount').textContent = tipsterFollows.length;
  document.getElementById('compMatchRate').textContent = matchRate + '%';
  document.getElementById('compMostUsedBook').textContent = mostUsedBook;
  
  document.getElementById('comparisonSection').style.display = 'block';
}

function renderMyStats(tipsterId) {
  const tipsterFollows = state.userFollows.filter(f => f.tipsterId === tipsterId);
  
  if (tipsterFollows.length === 0) {
    document.getElementById('myStatsMessage').style.display = 'block';
    document.getElementById('myStatsContent').style.display = 'none';
    return;
  }
  
  document.getElementById('myStatsMessage').style.display = 'none';
  document.getElementById('myStatsContent').style.display = 'block';
  
  const resolvedFollows = tipsterFollows.filter(f => f.isResolved && f.userResult !== 'Void');
  const wonFollows = resolvedFollows.filter(f => f.userResult === 'Ganada');
  
  const totalFollowed = tipsterFollows.length;
  const myWinrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length * 100).toFixed(2) : 0;
  
  let totalStaked = 0;
  let totalProfit = 0;
  resolvedFollows.forEach(f => {
    totalStaked += f.userStake;
    totalProfit += f.profitFromFollow;
  });
  
  const myYield = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  const myAvgOdds = tipsterFollows.length > 0 ? (tipsterFollows.reduce((sum, f) => sum + f.userOdds, 0) / tipsterFollows.length).toFixed(2) : 0;
  const myAvgStake = tipsterFollows.length > 0 ? (tipsterFollows.reduce((sum, f) => sum + f.userStake, 0) / tipsterFollows.length).toFixed(2) : 0;
  
  document.getElementById('myStatsFollowed').textContent = totalFollowed;
  document.getElementById('myStatsWinrate').textContent = myWinrate + '%';
  document.getElementById('myStatsYield').textContent = myYield + '%';
  document.getElementById('myStatsAvgOdds').textContent = myAvgOdds;
  document.getElementById('myStatsAvgStake').textContent = myAvgStake;
  
  const oddsRanges = {
    '1.00-1.50': tipsterFollows.filter(f => f.userOdds >= 1.00 && f.userOdds <= 1.50).length,
    '1.51-2.00': tipsterFollows.filter(f => f.userOdds > 1.50 && f.userOdds <= 2.00).length,
    '2.01-3.00': tipsterFollows.filter(f => f.userOdds > 2.00 && f.userOdds <= 3.00).length,
    '3.01+': tipsterFollows.filter(f => f.userOdds > 3.00).length
  };
  
  const oddsDistribution = {};
  Object.keys(oddsRanges).forEach(range => {
    oddsDistribution[range] = tipsterFollows.length > 0
      ? ((oddsRanges[range] / tipsterFollows.length) * 100).toFixed(2)
      : 0;
  });
  
  const stakeRanges = {
    '1-3': tipsterFollows.filter(f => f.userStake >= 1 && f.userStake <= 3).length,
    '4-6': tipsterFollows.filter(f => f.userStake > 3 && f.userStake <= 6).length,
    '7-10': tipsterFollows.filter(f => f.userStake > 6 && f.userStake <= 10).length,
    '10+': tipsterFollows.filter(f => f.userStake > 10).length
  };
  
  const stakeDistribution = {};
  Object.keys(stakeRanges).forEach(range => {
    stakeDistribution[range] = tipsterFollows.length > 0
      ? ((stakeRanges[range] / tipsterFollows.length) * 100).toFixed(2)
      : 0;
  });
  
  const bookmakers = {};
  tipsterFollows.forEach(f => {
    bookmakers[f.userBookmaker] = (bookmakers[f.userBookmaker] || 0) + 1;
  });
  
  const bookmakerDistribution = {};
  Object.keys(bookmakers).forEach(bm => {
    bookmakerDistribution[bm] = ((bookmakers[bm] / tipsterFollows.length) * 100).toFixed(2);
  });
  
  let totalOddsDiff = 0;
  let oddsDiffCount = 0;
  tipsterFollows.forEach(f => {
    const pick = state.picks.find(p => p.id === f.pickId);
    if (pick) {
      totalOddsDiff += (f.userOdds - pick.odds);
      oddsDiffCount++;
    }
  });
  const avgOddsDiff = oddsDiffCount > 0 ? (totalOddsDiff / oddsDiffCount).toFixed(2) : '0.00';
  
  let matchCount = 0;
  let totalStakeDiff = 0;
  let stakeDiffCount = 0;
  tipsterFollows.forEach(f => {
    const pick = state.picks.find(p => p.id === f.pickId);
    if (pick) {
      if (f.userResult === pick.result && f.isResolved) {
        matchCount++;
      }
      totalStakeDiff += (f.userStake - pick.stake);
      stakeDiffCount++;
    }
  });
  const matchRate = resolvedFollows.length > 0 ? (matchCount / resolvedFollows.length * 100).toFixed(2) : '0.00';
  const avgStakeDiff = stakeDiffCount > 0 ? (totalStakeDiff / stakeDiffCount).toFixed(2) : '0.00';
  
  document.getElementById('myStatsMatchRate').textContent = matchRate + '%';
  document.getElementById('myStatsOddsDiffAvg').textContent = avgOddsDiff;
  document.getElementById('myStatsStakeDiffAvg').textContent = avgStakeDiff;
  
  const oddsDiffEl = document.getElementById('myOddsDiff');
  oddsDiffEl.textContent = avgOddsDiff;
  oddsDiffEl.style.color = parseFloat(avgOddsDiff) >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

  if (state.charts.myOdds) state.charts.myOdds.destroy();
  if (state.charts.myStake) state.charts.myStake.destroy();
  if (state.charts.myBookmaker) state.charts.myBookmaker.destroy();

  const myOddsCtx = document.getElementById('myOddsDistChart');
  if (myOddsCtx) {
    state.charts.myOdds = new Chart(myOddsCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(oddsDistribution),
        datasets: [{
          label: 'Porcentaje',
          data: Object.values(oddsDistribution),
          backgroundColor: chartColors[0]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return value + '%'; }
            }
          }
        }
      }
    });
  }
  
  const myStakeCtx = document.getElementById('myStakeDistChart');
  if (myStakeCtx) {
    const stakeData = Object.entries(stakeDistribution).filter(([, percent]) => parseFloat(percent) > 0);
    state.charts.myStake = new Chart(myStakeCtx, {
      type: 'pie',
      data: {
        labels: stakeData.map(([range]) => 'Stake ' + range),
        datasets: [{
          data: stakeData.map(([, percent]) => percent),
          backgroundColor: chartColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
  
  const myBookmakerCtx = document.getElementById('myBookmakerChart');
  if (myBookmakerCtx) {
    const bmData = Object.entries(bookmakerDistribution).filter(([, percent]) => parseFloat(percent) > 0);
    state.charts.myBookmaker = new Chart(myBookmakerCtx, {
      type: 'doughnut',
      data: {
        labels: bmData.map(([bm]) => bm),
        datasets: [{
          data: bmData.map(([, percent]) => percent),
          backgroundColor: chartColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

export { renderTipsterDetail, renderTipsterFollows, renderFollowComparison, renderMyStats };