/**
 * @fileoverview Utilidades puras de UI para manipulación de DOM y helpers visuales
 * @module utils/ui-helpers
 */

import { state } from "../core/state.js";
import { sportIcons } from "../data/constants.js";

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.add('visible');
  } else {
    overlay.classList.remove('visible');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const toggle = dropdown.previousElementSibling;

  document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
    if (menu.id !== dropdownId) {
      menu.classList.remove('active');
      menu.previousElementSibling.classList.remove('active');
    }
  });

  dropdown.classList.toggle('active');
  toggle.classList.toggle('active');
}

function switchViewUI(viewName) {
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.classList.remove('active'));

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  if (viewName === 'dashboard') {
    document.getElementById('dashboardView').classList.add('active');
    const tab1 = document.getElementById('tabDashboard');
    const tab2 = document.getElementById('tabDashboard2');
    if (tab1) tab1.classList.add('active');
    if (tab2) tab2.classList.remove('active');
  } else if (viewName === 'allPicks') {
    document.getElementById('allPicksView').classList.add('active');
    const tab1 = document.getElementById('tabAllPicks');
    const tab2 = document.getElementById('tabAllPicks2');
    if (tab1) tab1.classList.remove('active');
    if (tab2) tab2.classList.add('active');
  } else if (viewName === 'myPicks') {
    document.getElementById('myPicksView').classList.add('active');
  } else if (viewName === 'tipsterDetail') {
    document.getElementById('tipsterDetailView').classList.add('active');
  }
}

function switchDetailTabUI(tabName) {
  document.querySelectorAll('.detail-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.detail-tab-content').forEach(content => content.classList.remove('active'));

  if (tabName === 'stats') {
    document.querySelectorAll('.detail-tab')[0].classList.add('active');
    document.getElementById('statsTab').classList.add('active');
    document.getElementById('comparisonSection').style.display = 'none';
  } else if (tabName === 'myStats') {
    document.querySelectorAll('.detail-tab')[1].classList.add('active');
    document.getElementById('myStatsTab').classList.add('active');
  } else if (tabName === 'follows') {
    document.querySelectorAll('.detail-tab')[2].classList.add('active');
    document.getElementById('followsTab').classList.add('active');
    document.getElementById('comparisonSection').style.display = 'block';
  }
}

function updateDropdownText() {
  const sportCheckboxes = document.querySelectorAll('#sportDropdown input:checked');
  const sportText = document.getElementById('sportDropdownText');
  if (sportCheckboxes.length === 0) {
    sportText.textContent = 'Seleccionar deportes';
  } else if (sportCheckboxes.length === 1) {
    sportText.textContent = sportCheckboxes[0].value;
  } else {
    sportText.textContent = `${sportCheckboxes.length} deportes seleccionados`;
  }

  const channelCheckboxes = document.querySelectorAll('#channelDropdown input:checked');
  const channelText = document.getElementById('channelDropdownText');
  if (channelCheckboxes.length === 0) {
    channelText.textContent = 'Seleccionar canales';
  } else if (channelCheckboxes.length === 1) {
    channelText.textContent = channelCheckboxes[0].value;
  } else {
    channelText.textContent = `${channelCheckboxes.length} canales seleccionados`;
  }
}

function toggleFilterCheckboxUI(event) {
  event.stopPropagation();
  const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  updateDropdownText();
}

function clearSearchUI() {
  document.getElementById('tipsterSearch').value = '';
}

function updatePickTipsterSelect() {
  const select = document.getElementById('pickTipster');
  select.innerHTML = '<option value="">Selecciona un tipster</option>' +
    state.tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function updateFilterSelects() {
  const tipsterFilter = document.getElementById('filterTipster');
  tipsterFilter.innerHTML = '<option value="all">Todos los Tipsters</option>' +
    state.tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

  const sports = [...new Set(state.picks.map(p => p.sport))];
  const sportFilter = document.getElementById('filterSport');
  sportFilter.innerHTML = '<option value="all">Todos los Deportes</option>' +
    sports.map(s => {
      const icon = sportIcons[s] || '🎲';
      return `<option value="${s}">${icon} ${s}</option>`;
    }).join('');
  
  const channels = [...new Set(state.tipsters.map(t => t.channel))];
  const channelFilter = document.getElementById('filterChannel');
  channelFilter.innerHTML = '<option value="all">Todos los Canales</option>' +
    channels.map(c => `<option value="${c}">${c}</option>`).join('');

  const bookmakers = [...new Set(state.userFollows.map(f => f.userBookmaker).filter(b => b))];
  const bookmakerFilter = document.getElementById('filterBookmaker');
  bookmakerFilter.innerHTML = '<option value="all">Todas las Casas</option>' +
    bookmakers.map(b => `<option value="${b}">${b}</option>`).join('');
}

function updateFollowFilterSelects() {
  const tipsterFilter = document.getElementById('followFilterTipster');
  tipsterFilter.innerHTML = '<option value="all">Todos los Tipsters</option>' +
    state.tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

export {
  showLoading,
  closeModal,
  toggleDropdown,
  switchViewUI,
  switchDetailTabUI,
  updateDropdownText,
  toggleFilterCheckboxUI,
  clearSearchUI,
  updatePickTipsterSelect,
  updateFilterSelects,
  updateFollowFilterSelects
};
