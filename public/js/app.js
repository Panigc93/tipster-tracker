import { db } from './core/init.js';
import { sportIcons } from './data/constants.js';
import { setupAuthListeners } from './core/auth.js';
import { state } from './core/state.js';
import { clearSearchUI, closeModal, showLoading, switchDetailTabUI, 
  switchViewUI, toggleDropdown, toggleFilterCheckboxUI, updateDropdownText, 
  updateFilterSelects} from './utils/ui-helpers.js';
import { addFollow, showFollowPickModal } from './modals/follow-modal.js';
import { addPickToFirestore, deletePickFromFirestore, editPick, updatePickInFirestore } from './services/pick.service.js';
import { addFollowToFirestore, deleteFollowFromFirestore, updateFollowInFirestore } from './services/follow.service.js';
import { addTipster, addTipsterToFirestore, confirmResetTipster, updateTipsterInFirestore } from './services/tipster.service.js';
import { setupTipsterModalListeners, showAddTipsterModal } from './modals/tipster-modal.js';
import { setupPickModalListeners, showAddPickModal } from './modals/pick-modal.js';
import { applyFilters, filterFollowedPicks, filterPicks, initializeFilters, resetFilters } from './utils/filters.js';
import { renderDashboard, renderDashboardPersonalStats, setupDashboardListeners } from './views/dashboard.js';
import { renderMyPicks } from './views/my-picks.js';
import { renderFollowComparison, renderMyStats, renderTipsterDetail, renderTipsterFollows } from './views/tipster-detail.js';
import { renderAllPicks } from './views/all-picks.js';
import { setupFollowsListener, setupPicksListener, setupTipstersListener } from './data/listeners-init.js';

export function initApp() {
  if (!state.currentUser) return;
  
  showLoading(true);
  
  setupTipstersListener();
  setupPicksListener();
  setupFollowsListener();
  
  initializeFilters();
  
  const today = new Date().toISOString().split('T')[0];
  const pickDateEl = document.getElementById('pickDate');
  if (pickDateEl) pickDateEl.value = today;
}

function toggleFilterOption(event, type, value) {
  toggleFilterCheckboxUI(event);
  applyFilters();
}

function clearSearch() {
  clearSearchUI();
  applyFilters();
}

function loadSampleData() {
  state.tipsters = [
    { id: 1, name: 'ProTipster', channel: 'Telegram', createdDate: '2025-01-01', lastPickDate: '2025-11-06' },
    { id: 2, name: 'SportsMaster', channel: 'BlogaBet', createdDate: '2025-01-15', lastPickDate: '2025-11-05' },
    { id: 3, name: 'CornerKing', channel: 'TipsterLand', createdDate: '2025-02-01', lastPickDate: '2025-11-03' }
  ];

  state.picks = [
    {
      id: 1,
      tipsterId: 1,
      sport: 'Fútbol',
      odds: 1.85,
      stake: 5,
      pickType: 'Pre',
      betType: 'Vencedor Madrid',
      date: '2025-10-20',
      result: 'Ganada',
      isResolved: true,
      match: 'Real Madrid vs Barcelona',
      comments: 'Análisis técnico perfecto',
      status: 'Seguido',
      userFollowId: 1
    },
    {
      id: 2,
      tipsterId: 1,
      sport: 'Baloncesto',
      odds: 2.10,
      stake: 3,
      pickType: 'Live',
      betType: 'Lakers Over 110.5 puntos',
      date: '2025-10-22',
      result: 'Perdida',
      isResolved: true,
      match: 'Lakers vs Warriors',
      comments: '',
      status: 'Error',
      userFollowId: 2
    },
    {
      id: 3,
      tipsterId: 2,
      sport: 'Fútbol',
      odds: 1.65,
      stake: 7,
      pickType: 'Pre',
      betType: 'Corners Over 10.5',
      date: '2025-10-25',
      result: 'Ganada',
      isResolved: true,
      match: 'Liverpool vs Manchester City',
      comments: 'Buena estrategia defensiva',
      status: 'Seguido',
      userFollowId: 3
    },
    {
      id: 4,
      tipsterId: 3,
      sport: 'Motor',
      odds: 2.50,
      stake: 4,
      pickType: 'Pre',
      betType: 'Verstappen Ganador',
      date: '2025-10-28',
      result: 'Ganada',
      isResolved: true,
      match: 'GP Brasil',
      comments: 'Verstappen domina',
      status: 'No Seguido'
    },
    {
      id: 5,
      tipsterId: 1,
      sport: 'Tenis',
      odds: 1.92,
      stake: 6,
      pickType: 'Pre',
      betType: 'Djokovic Gana',
      date: '2025-10-30',
      result: 'Ganada',
      isResolved: true,
      match: 'Djokovic vs Nadal',
      comments: 'Resultado esperado',
      status: 'Seguido',
      userFollowId: 4
    },
    {
      id: 6,
      tipsterId: 1,
      sport: 'Esports',
      odds: 1.75,
      stake: 3,
      pickType: 'Pre',
      betType: 'G2 Esports Win',
      date: '2025-11-01',
      result: 'Ganada',
      isResolved: true,
      match: 'LEC Finals',
      comments: 'G2 en gran forma',
      status: 'Seguido',
      userFollowId: 5
    },
    {
      id: 7,
      tipsterId: 2,
      sport: 'Caballos',
      odds: 3.20,
      stake: 2,
      pickType: 'Pre',
      betType: 'Thunder Bolt gana',
      date: '2025-11-02',
      result: 'Perdida',
      isResolved: true,
      match: 'Derby Inglés',
      comments: 'El favorito falló',
      status: 'Error',
      userFollowId: 6
    },
    {
      id: 8,
      tipsterId: 1,
      sport: 'Dardos',
      odds: 2.05,
      stake: 4,
      pickType: 'Pre',
      betType: 'Van Gerwen Gana',
      date: '2025-11-03',
      result: 'Ganada',
      isResolved: true,
      match: 'World Championship',
      comments: 'Gran forma',
      status: 'No Seguido'
    },
    {
      id: 9,
      tipsterId: 3,
      sport: 'Rugby',
      odds: 1.90,
      stake: 5,
      pickType: 'Pre',
      betType: 'All Blacks Ganan',
      date: '2025-11-04',
      result: 'Perdida',
      isResolved: true,
      match: 'All Blacks vs Springboks',
      comments: 'Sorpresa',
      status: 'No Seguido'
    },
    {
      id: 10,
      tipsterId: 1,
      sport: 'Fórmula 1',
      odds: 1.65,
      stake: 6,
      pickType: 'Pre',
      betType: 'Hamilton Podio',
      date: '2025-11-05',
      result: 'Ganada',
      isResolved: true,
      match: 'GP Las Vegas',
      comments: 'Hamilton remonta',
      status: 'Seguido',
      userFollowId: 7
    },
    {
      id: 11,
      tipsterId: 2,
      sport: 'Golf',
      odds: 2.80,
      stake: 3,
      pickType: 'Pre',
      betType: 'McIlroy Top 5',
      date: '2025-11-06',
      result: 'Pendiente',
      isResolved: false,
      match: 'Masters',
      comments: 'En juego',
      status: 'No Seguido'
    }
  ];

  state.userFollows = [
    {
      id: 1,
      tipsterId: 1,
      pickId: 1,
      tipsterBookmaker: 'Bet365',
      userBookmaker: 'Betfair',
      userOdds: 1.82,
      userStake: 5,
      userBetType: 'Vencedor Madrid',
      userResult: 'Ganada',
      isError: false,
      dateFollowed: '2025-10-20',
      isResolved: true,
      profitFromFollow: 4.1,
      comments: 'Apostar en diferente casa funcionó bien'
    },
    {
      id: 2,
      tipsterId: 1,
      pickId: 2,
      tipsterBookmaker: '1xBet',
      userBookmaker: 'Betfair',
      userOdds: 2.05,
      userStake: 4,
      userBetType: 'Lakers Over 109.5 puntos',
      userResult: 'Ganada',
      isError: true,
      dateFollowed: '2025-10-22',
      isResolved: true,
      profitFromFollow: 4.2,
      comments: 'Cambié la línea pero salió bien'
    },
    {
      id: 3,
      tipsterId: 2,
      pickId: 3,
      tipsterBookmaker: 'Pinnacle',
      userBookmaker: 'Bet365',
      userOdds: 1.70,
      userStake: 5,
      userBetType: 'Corners Over 10.5',
      userResult: 'Perdida',
      isError: false,
      dateFollowed: '2025-10-25',
      isResolved: true,
      profitFromFollow: -5,
      comments: 'La casa cambió la línea'
    },
    {
      id: 4,
      tipsterId: 1,
      pickId: 5,
      tipsterBookmaker: 'Bet365',
      userBookmaker: '1xBet',
      userOdds: 1.88,
      userStake: 6,
      userBetType: 'Djokovic Gana',
      userResult: 'Ganada',
      isError: false,
      dateFollowed: '2025-10-30',
      isResolved: true,
      profitFromFollow: 5.28,
      comments: 'Bien apostado'
    },
    {
      id: 5,
      tipsterId: 1,
      pickId: 6,
      tipsterBookmaker: 'Betfair',
      userBookmaker: 'Betfair',
      userOdds: 1.75,
      userStake: 3,
      userBetType: 'G2 Esports Win',
      userResult: 'Ganada',
      isError: false,
      dateFollowed: '2025-11-01',
      isResolved: true,
      profitFromFollow: 2.25,
      comments: ''
    },
    {
      id: 6,
      tipsterId: 2,
      pickId: 7,
      tipsterBookmaker: 'Bet365',
      userBookmaker: '1xBet',
      userOdds: 3.15,
      userStake: 2,
      userBetType: 'Thunder Bolt gana',
      userResult: 'Perdida',
      isError: true,
      dateFollowed: '2025-11-02',
      isResolved: true,
      profitFromFollow: -2,
      comments: 'Error al leer la carrera'
    },
    {
      id: 7,
      tipsterId: 1,
      pickId: 10,
      tipsterBookmaker: 'Pinnacle',
      userBookmaker: 'Bet365',
      userOdds: 1.68,
      userStake: 5,
      userBetType: 'Hamilton Podio',
      userResult: 'Ganada',
      isError: false,
      dateFollowed: '2025-11-05',
      isResolved: true,
      profitFromFollow: 3.4,
      comments: 'Buena apuesta'
    }
  ];
  
  state.nextTipsterId = Math.max(...state.tipsters.map(t => t.id)) + 1;
  state.nextPickId = Math.max(...state.picks.map(p => p.id)) + 1;
  state.nextFollowId = state.userFollows.length > 0 ? Math.max(...state.userFollows.map(f => f.id)) + 1 : 1;

  state.tipsters.forEach(tipster => {
    const tipsterPicks = state.picks.filter(p => p.tipsterId === tipster.id);
    if (tipsterPicks.length > 0) {
      const dates = tipsterPicks.map(p => new Date(p.date));
      const lastDate = new Date(Math.max(...dates));
      tipster.lastPickDate = lastDate.toISOString().split('T')[0];
    }
  });
  
  renderDashboardPersonalStats();
}

function showView(viewName) {
  switchViewUI(viewName);
    state.currentView = viewName;
  
  if (viewName === 'dashboard') {
    renderDashboard();
  } else if (viewName === 'allPicks') {
    updateFilterSelects();
    renderAllPicks();
  } else if (viewName === 'myPicks') {
    renderMyPicks();
  } else if (viewName === 'tipsterDetail') {
    renderTipsterDetail(state.currentTipsterId);
  }
}

function showDetailTab(tabName) {
  switchDetailTabUI(tabName);
  
  if (tabName === 'myStats') {
    renderMyStats(state.currentTipsterId);
  } else if (tabName === 'follows') {
    renderTipsterFollows(state.currentTipsterId);
    renderFollowComparison(state.currentTipsterId);
  }
}

function showTipsterDetail(tipsterId) {
  state.currentTipsterId = tipsterId;
  showView('tipsterDetail');
}

function toggleFollowSection() {
  const checkbox = document.getElementById('pickFollowed');
  const section = document.getElementById('followSection');
  section.style.display = checkbox.checked ? 'block' : 'none';
  
  if (checkbox.checked) {
    const betType = document.getElementById('pickBetType').value;
    document.getElementById('pickUserBetType').value = betType;
  } else {
    document.getElementById('pickUserOdds').value = '';
    document.getElementById('pickUserStake').value = '';
    document.getElementById('pickUserBetType').value = '';
    document.getElementById('pickTipsterBookmaker').value = '';
    document.getElementById('pickUserBookmaker').value = '';
    document.getElementById('pickUserResult').value = 'Pendiente';
    document.getElementById('pickIsError').checked = false;
    document.getElementById('pickFollowComments').value = '';
  }
}

function toggleEditFollowSection() {
  const checkbox = document.getElementById('editPickFollowed');
  const section = document.getElementById('editFollowSection');
  section.style.display = checkbox.checked ? 'block' : 'none';
  
  if (checkbox.checked && !document.getElementById('editFollowId').value) {
    const betType = document.getElementById('editPickBetType').value;
    document.getElementById('editPickUserBetType').value = betType;
  } else if (!checkbox.checked) {
    document.getElementById('editPickUserOdds').value = '';
    document.getElementById('editPickUserStake').value = '';
    document.getElementById('editPickUserBetType').value = '';
    document.getElementById('editPickTipsterBookmaker').value = '';
    document.getElementById('editPickUserBookmaker').value = '';
    document.getElementById('editPickUserResult').value = 'Pendiente';
    document.getElementById('editPickIsError').checked = false;
    document.getElementById('editPickFollowComments').value = '';
    document.getElementById('editFollowId').value = '';
  }
}

function togglePickStatus(pickId) {
  editPick(pickId);
}


document.addEventListener('DOMContentLoaded', () => {
  setupAuthListeners();
  setupDashboardListeners();
  setupPickModalListeners();
  setupTipsterModalListeners();

  // Navegación
  document.getElementById('tabDashboard')?.addEventListener('click', () => showView('dashboard'));
  document.getElementById('tabAllPicks')?.addEventListener('click', () => showView('allPicks'));
  document.getElementById('tabDashboard2')?.addEventListener('click', () => showView('dashboard'));
  document.getElementById('tabAllPicks2')?.addEventListener('click', () => showView('allPicks'));
  document.getElementById('tabDashboard3')?.addEventListener('click', () => showView('dashboard'));
  document.getElementById('tabAllPicks3')?.addEventListener('click', () => showView('allPicks'));
  document.getElementById('tabMyPicks')?.addEventListener('click', () => showView('myPicks'));

  // Navegación en detalle tipster
  document.getElementById('backToDashboardBtn')?.addEventListener('click', () => showView('dashboard'));
  document.getElementById('resetTipsterBtn')?.addEventListener('click', () => confirmResetTipster(state.currentTipsterId));
  document.getElementById('tabStatsBtn')?.addEventListener('click', () => showDetailTab('stats'));
  document.getElementById('tabMyStatsBtn')?.addEventListener('click', () => showDetailTab('myStats'));
  document.getElementById('tabFollowsBtn')?.addEventListener('click', () => showDetailTab('follows'));

  // Dropdown filtros
  document.getElementById('sportDropdownToggle')?.addEventListener('click', () => toggleDropdown('sportDropdown'));
  document.getElementById('channelDropdownToggle')?.addEventListener('click', () => toggleDropdown('channelDropdown'));
  

  document.getElementById('filterTipster')?.addEventListener('change', filterPicks);
  document.getElementById('filterSport')?.addEventListener('change', filterPicks);
  document.getElementById('filterStatus')?.addEventListener('change', filterPicks);
  document.getElementById('filterChannel')?.addEventListener('change', filterPicks);
  document.getElementById('filterBookmaker')?.addEventListener('change', filterPicks);
  document.getElementById('filterResult')?.addEventListener('change', filterPicks);

  // Filtros de picks seguidos (Mis Picks Seguidos)
  document.getElementById('followFilterTipster')?.addEventListener('change', filterFollowedPicks);
  document.getElementById('followFilterResult')?.addEventListener('change', filterFollowedPicks);
  document.getElementById('followFilterMatch')?.addEventListener('change', filterFollowedPicks);

  // Checkbox de seguimiento de pick (Add Pick Modal)
  document.getElementById('pickFollowed')?.addEventListener('change', toggleFollowSection);

  // Checkbox de seguimiento en edición de pick (Edit Pick Modal)
  document.getElementById('editPickFollowed')?.addEventListener('change', toggleEditFollowSection);

  // Otros inputs de filtros (usa el mismo patrón, ejemplo para Yield mínimo y demás)
  document.getElementById('yieldMinInput')?.addEventListener('change', applyFilters);

  // Si tu campo busca tipster por texto (input), usa "input" en vez de "change"
  document.getElementById('tipsterSearch')?.addEventListener('input', applyFilters);

  // Delegación para sportDropdown
  document.getElementById('sportDropdown')?.addEventListener('click', (event) => {
    const item = event.target.closest('.dropdown-item');
    if (item) {
      const sport = item.querySelector('input').value;
      toggleFilterOption(event, 'sport', sport);
    }
  });

  // Delegación para channelDropdown
  document.getElementById('channelDropdown')?.addEventListener('click', (event) => {
    const item = event.target.closest('.dropdown-item');
    if (item) {
      const channel = item.querySelector('input').value;
      toggleFilterOption(event, 'channel', channel);
    }
  });

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.custom-dropdown')) {
      document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
        menu.classList.remove('active');
        menu.previousElementSibling.classList.remove('active');
      });
    }
  });

  // Delegación para tarjetas de tipsters en el dashboard
  document.getElementById('tipstersGrid').addEventListener('click', (event) => {
    const card = event.target.closest('.tipster-card');
    if (card && card.dataset.tipsterId) {
      showTipsterDetail(card.dataset.tipsterId);
    }
  });

  // Delegación para tablas de picks
  const pickTables = [
    document.getElementById('allPicksBody'),
    document.getElementById('detailPicksBody'),
  ].filter(Boolean);

  pickTables.forEach(tbody => {
    tbody.addEventListener('click', (event) => {
      const tr = event.target.closest('tr[data-pick-id]');
      if (!tr) return;
      const pickId = tr.dataset.pickId;

      if (event.target.classList.contains('status-badge-clickable')) {
        togglePickStatus(pickId);
      } else if (event.target.classList.contains('edit-pick-btn')) {
        editPick(pickId);
      } else if (event.target.classList.contains('follow-pick-btn')) {
        showFollowPickModal(pickId);
      }
    });
  });

  lucide.createIcons();
});