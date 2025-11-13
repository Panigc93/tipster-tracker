/**
 * Módulo para mostrar gráficos.
 * @fileoverview Módulo de vista para gráficos
 * @module views/charts
 */

import { state } from "../core/state.js";
import { chartColors } from "../data/constants.js";

function renderCharts(stats) {  
  Object.values(state.charts).forEach(chart => {
    if (chart) chart.destroy();
  });
  state.charts = {};
  
  const oddsCtx = document.getElementById('oddsDistChart');
  if (oddsCtx) {
    state.charts.odds = new Chart(oddsCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(stats.oddsDistribution),
        datasets: [{
          label: 'Porcentaje',
          data: Object.values(stats.oddsDistribution),
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
  
  const stakeCtx = document.getElementById('stakeDistChart');
  if (stakeCtx) {
    const stakeData = Object.entries(stats.stakeDistribution)
      .filter(([stake, percent]) => parseFloat(percent) > 0);
    
    state.charts.stake = new Chart(stakeCtx, {
      type: 'pie',
      data: {
        labels: stakeData.map(([stake]) => 'Stake ' + stake),
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
  
  const sportsCtx = document.getElementById('sportsChart');
  if (sportsCtx) {
    const sportsData = Object.entries(stats.sportDistribution)
      .filter(([sport, percent]) => parseFloat(percent) > 0);
    
    state.charts.sports = new Chart(sportsCtx, {
      type: 'doughnut',
      data: {
        labels: sportsData.map(([sport]) => sport),
        datasets: [{
          data: sportsData.map(([, percent]) => percent),
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
  
  const pickTypesCtx = document.getElementById('pickTypesChart');
  if (pickTypesCtx) {
    const typeData = Object.entries(stats.pickTypeDistribution)
      .filter(([type, percent]) => parseFloat(percent) > 0);
    state.charts.pickTypes = new Chart(pickTypesCtx, {
      type: 'bar',
      data: {
        labels: typeData.map(([type]) => type),
        datasets: [{
          label: 'Porcentaje',
          data: typeData.map(([, percent]) => percent),
          backgroundColor: chartColors.slice(0, typeData.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return value + '%'; }
            }
          }
        }
      }
    });
  }
}
export { renderCharts };