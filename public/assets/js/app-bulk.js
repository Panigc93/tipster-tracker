let auth, db;
let currentUser = null;
let unsubscribeTipsters = null;
let unsubscribePicks = null;
let unsubscribeFollows = null;

try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  console.log('Firebase initialized successfully');
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Usando Firebase Emulators');
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', 8080);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  alert('Error: Firebase no está configurado correctamente. Revisa la configuración en app.js');
}

let tipsters = [];
let picks = [];
let userFollows = [];
let currentView = 'dashboard';
let currentTipsterId = null;
let nextTipsterId = 1;
let nextPickId = 1;
let nextFollowId = 1;
let charts = {};
let dashboardFilters = {
  sports: [],
  channels: [],
  yieldMin: -1000,
  lastPickDays: 'all',
  sortBy: 'yield',
  searchQuery: ''
};
let yieldDebounceTimer = null;


const sportIcons = {
  'Fútbol': '⚽',
  'Baloncesto': '🏀',
  'Tenis': '🎾',
  'Fútbol Americano': '🏈',
  'Hockey': '🏒',
  'Béisbol': '⚾',
  'Dardos': '🎯',
  'Caballos': '🐴',
  'Motor': '🏎️',
  'Esports': '🎮',
  'Fórmula 1': '🏁',
  'Golf': '⛳',
  'Rugby': '🏉',
  'Cricket': '🏏',
  'Otro': '🎲'
};

const allSports = ['Fútbol', 'Baloncesto', 'Tenis', 'Fútbol Americano', 'Hockey', 'Béisbol', 'Dardos', 'Caballos', 'Motor', 'Esports', 'Fórmula 1', 'Golf', 'Rugby', 'Cricket', 'Otro'];
const allChannels = ['BlogaBet', 'Telegram', 'TipsterLand', 'Twitter/X', 'Discord', 'Otro'];
const allBookmakers = ['1xBet', 'Betfair', 'Bet365', 'William Hill', 'Marathonbet', 'Pinnacle', 'Supabets', 'Otro'];


function showAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    tabs[0].classList.add('active');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
  } else {
    tabs[1].classList.add('active');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  
  showLoading(true);
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      errorEl.classList.remove('visible');
    })
    .catch(error => {
      showLoading(false);
      errorEl.textContent = getAuthErrorMessage(error.code);
      errorEl.classList.add('visible');
    });
}

function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const errorEl = document.getElementById('signupError');
  
  if (password !== passwordConfirm) {
    errorEl.textContent = 'Las contraseñas no coinciden';
    errorEl.classList.add('visible');
    return;
  }
  
  showLoading(true);
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      errorEl.classList.remove('visible');
    })
    .catch(error => {
      showLoading(false);
      errorEl.textContent = getAuthErrorMessage(error.code);
      errorEl.classList.add('visible');
    });
}

function handleSignOut() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    auth.signOut();
  }
}

function getAuthErrorMessage(code) {
  const errors = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión'
  };
  return errors[code] || 'Error de autenticación: ' + code;
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(inputId + 'Icon');
  
  if (!input || !icon) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  lucide.createIcons();
}

function showForgotPasswordModal() {
  const modal = document.getElementById('forgotPasswordModal');
  const emailInput = document.getElementById('forgotEmail');
  const errorEl = document.getElementById('forgotError');
  const successEl = document.getElementById('forgotSuccess');
  
  console.log(modal)
  modal.classList.add('active');
  emailInput.value = '';
  errorEl.classList.remove('visible');
  successEl.classList.remove('visible');
  emailInput.focus();
}

function handleForgotPassword(event) {
  event.preventDefault();
  
  const email = document.getElementById('forgotEmail').value;
  const errorEl = document.getElementById('forgotError');
  const successEl = document.getElementById('forgotSuccess');
  
  errorEl.classList.remove('visible');
  successEl.classList.remove('visible');
  
  showLoading(true);
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      showLoading(false);
      successEl.classList.add('visible');
      errorEl.classList.remove('visible');
      
      setTimeout(() => {
        closeModal('forgotPasswordModal');
      }, 3000);
    })
    .catch((error) => {
      showLoading(false);
      errorEl.textContent = getPasswordResetErrorMessage(error.code);
      errorEl.classList.add('visible');
      successEl.classList.remove('visible');
    });
}

function getPasswordResetErrorMessage(code) {
  const errors = {
    'auth/user-not-found': 'No existe ninguna cuenta con este email',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión'
  };
  return errors[code] || `Error al enviar email: ${code}`;
}


function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.add('visible');
  } else {
    overlay.classList.remove('visible');
  }
}

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userEmailDisplay').textContent = user.email;
    initApp();
  } else {
    currentUser = null;
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    showLoading(false);
    
    if (unsubscribeTipsters) unsubscribeTipsters();
    if (unsubscribePicks) unsubscribePicks();
    if (unsubscribeFollows) unsubscribeFollows();
    
    tipsters = [];
    picks = [];
    userFollows = [];
  }
});

function initApp() {
  if (!currentUser) return;
  
  showLoading(true);
  
  setupTipstersListener();
  setupPicksListener();
  setupFollowsListener();
  
  initializeFilters();
  
  const today = new Date().toISOString().split('T')[0];
  const pickDateEl = document.getElementById('pickDate');
  if (pickDateEl) pickDateEl.value = today;
}

function setupTipstersListener() {
  if (!currentUser) return;
  
  unsubscribeTipsters = db.collection('tipsters')
    .where('uid', '==', currentUser.uid)
    .onSnapshot(snapshot => {
      tipsters = [];
      snapshot.forEach(doc => {
        tipsters.push({ id: doc.id, ...doc.data() });
      });
      renderDashboard();
      updatePickTipsterSelect();
      updateFilterSelects();
      showLoading(false);
    }, error => {
      console.error('Error loading tipsters:', error);
      showLoading(false);
      alert('Error al cargar tipsters: ' + error.message);
    });
}

function setupPicksListener() {
  if (!currentUser) return;
  
  unsubscribePicks = db.collection('picks')
    .where('uid', '==', currentUser.uid)
    .onSnapshot(snapshot => {
      picks = [];
      snapshot.forEach(doc => {
        picks.push({ id: doc.id, ...doc.data() });
      });
      
      tipsters.forEach(tipster => {
        const tipsterPicks = picks.filter(p => p.tipsterId === tipster.id);
        if (tipsterPicks.length > 0) {
          const dates = tipsterPicks.map(p => new Date(p.date));
          const lastDate = new Date(Math.max(...dates));
          tipster.lastPickDate = lastDate.toISOString().split('T')[0];
        }
      });
      
      if (currentView === 'allPicks') renderAllPicks();
      if (currentView === 'tipsterDetail') renderTipsterDetail(currentTipsterId);
      if (currentView === 'dashboard') renderDashboard();
    }, error => {
      console.error('Error loading picks:', error);
      alert('Error al cargar picks: ' + error.message);
    });
}

function setupFollowsListener() {
  if (!currentUser) return;
  
  unsubscribeFollows = db.collection('userFollows')
    .where('uid', '==', currentUser.uid)
    .onSnapshot(snapshot => {
      userFollows = [];
      snapshot.forEach(doc => {
        userFollows.push({ id: doc.id, ...doc.data() });
      });
      
      if (currentView === 'misPicks') renderMisPicks();
      if (currentView === 'tipsterDetail') renderTipsterDetail(currentTipsterId);
      renderDashboardPersonalStats();
    }, error => {
      console.error('Error loading follows:', error);
      alert('Error al cargar follows: ' + error.message);
    });
}

function initializeFilters() {
  const sports = allSports;
  const channels = allChannels;
  
  const sportDropdown = document.getElementById('sportDropdown');
  sportDropdown.innerHTML = sports.map(sport => `
    <div class="dropdown-item" onclick="toggleFilterOption(event, 'sport', '${sport}')">
      <input type="checkbox" value="${sport}" id="sport_${sport.replace(/\s+/g, '_')}">
      <label for="sport_${sport.replace(/\s+/g, '_')}">${sport}</label>
    </div>
  `).join('');
  
  const channelDropdown = document.getElementById('channelDropdown');
  channelDropdown.innerHTML = channels.map(channel => `
    <div class="dropdown-item" onclick="toggleFilterOption(event, 'channel', '${channel}')">
      <input type="checkbox" value="${channel}" id="channel_${channel.replace(/\s+/g, '_').replace('/', '_')}">
      <label for="channel_${channel.replace(/\s+/g, '_').replace('/', '_')}">${channel}</label>
    </div>
  `).join('');
  
  const yieldInput = document.getElementById('yieldMinInput');
  yieldInput.value = -1000;
  yieldInput.addEventListener('input', function() {
    clearTimeout(yieldDebounceTimer);
    yieldDebounceTimer = setTimeout(() => {
      applyFilters();
    }, 500);
  });
  
  document.getElementById('lastPickFilter').addEventListener('change', applyFilters);
  document.getElementById('sortBy').addEventListener('change', applyFilters);
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

function toggleFilterOption(event, type, value) {
  event.stopPropagation();
  const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  updateDropdownText();
  applyFilters();
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

document.addEventListener('click', function(event) {
  if (!event.target.closest('.custom-dropdown')) {
    document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
      menu.classList.remove('active');
      menu.previousElementSibling.classList.remove('active');
    });
  }
});

function updateDashboardFilters() {
  const sportCheckboxes = document.querySelectorAll('#sportDropdown input:checked');
  dashboardFilters.sports = Array.from(sportCheckboxes).map(cb => cb.value);
  
  const channelCheckboxes = document.querySelectorAll('#channelDropdown input:checked');
  dashboardFilters.channels = Array.from(channelCheckboxes).map(cb => cb.value);
  
  const yieldInput = document.getElementById('yieldMinInput');
  dashboardFilters.yieldMin = parseFloat(yieldInput.value) || -1000;
  
  dashboardFilters.lastPickDays = document.getElementById('lastPickFilter').value;
  
  dashboardFilters.sortBy = document.getElementById('sortBy').value;
  
  const searchInput = document.getElementById('tipsterSearch');
  dashboardFilters.searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const clearBtn = document.querySelector('.clear-search');
  if (clearBtn) {
    clearBtn.style.display = dashboardFilters.searchQuery ? 'inline-flex' : 'none';
  }
}

function clearSearch() {
  document.getElementById('tipsterSearch').value = '';
  applyFilters();
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
  
  dashboardFilters = {
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

function getLastPickDate(tipsterId) {
  const tipsterPicks = picks.filter(p => p.tipsterId === tipsterId);
  if (tipsterPicks.length === 0) return null;
  
  const dates = tipsterPicks.map(p => new Date(p.date));
  return new Date(Math.max(...dates));
}

function filterTipstersByFilters() {
  let filtered = [...tipsters];
  
  if (dashboardFilters.searchQuery) {
    filtered = filtered.filter(t => t.name.toLowerCase().includes(dashboardFilters.searchQuery));
  }
  
  if (dashboardFilters.sports.length > 0) {
    filtered = filtered.filter(t => {
      const tipsterPicks = picks.filter(p => p.tipsterId === t.id);
      const tipsterSports = [...new Set(tipsterPicks.map(p => p.sport))];
      return dashboardFilters.sports.some(sport => tipsterSports.includes(sport));
    });
  }
  
  if (dashboardFilters.channels.length > 0) {
    filtered = filtered.filter(t => dashboardFilters.channels.includes(t.channel));
  }
  
  if (dashboardFilters.yieldMin !== null) {
    filtered = filtered.filter(t => {
      const stats = calculateStats(t.id);
      const yield_ = parseFloat(stats.yield);
      return yield_ >= dashboardFilters.yieldMin;
    });
  }
  
  if (dashboardFilters.lastPickDays !== 'all') {
    const days = parseInt(dashboardFilters.lastPickDays);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    filtered = filtered.filter(t => {
      const lastPick = getLastPickDate(t.id);
      return lastPick && lastPick >= cutoffDate;
    });
  }
  
  filtered.sort((a, b) => {
    if (dashboardFilters.sortBy === 'yield') {
      const yieldA = parseFloat(calculateStats(a.id).yield);
      const yieldB = parseFloat(calculateStats(b.id).yield);
      return yieldB - yieldA;
    } else if (dashboardFilters.sortBy === 'winrate') {
      const wrA = parseFloat(calculateStats(a.id).winrate);
      const wrB = parseFloat(calculateStats(b.id).winrate);
      return wrB - wrA;
    } else if (dashboardFilters.sortBy === 'lastPick') {
      const dateA = getLastPickDate(a.id) || new Date(0);
      const dateB = getLastPickDate(b.id) || new Date(0);
      return dateB - dateA;
    }
    return 0;
  });
  
  return filtered;
}


async function addTipsterToFirestore(tipsterData) {
  try {
    const docRef = await db.collection('tipsters').add({
      uid: currentUser.uid,
      name: tipsterData.name,
      channel: tipsterData.channel,
      createdDate: tipsterData.createdDate,
      lastPickDate: tipsterData.lastPickDate || null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding tipster:', error);
    throw error;
  }
}

async function addPickToFirestore(pickData) {
  try {
    const docRef = await db.collection('picks').add({
      uid: currentUser.uid,
      tipsterId: pickData.tipsterId,
      sport: pickData.sport,
      odds: pickData.odds,
      stake: pickData.stake,
      pickType: pickData.pickType,
      betType: pickData.betType,
      date: pickData.date,
      result: pickData.result,
      isResolved: pickData.isResolved,
      match: pickData.match,
      comments: pickData.comments || '',
      status: pickData.status || 'No Seguido'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding pick:', error);
    throw error;
  }
}

async function updatePickInFirestore(pickId, pickData) {
  try {
    await db.collection('picks').doc(pickId).update(pickData);
  } catch (error) {
    console.error('Error updating pick:', error);
    throw error;
  }
}

async function addFollowToFirestore(followData) {
  try {
    const docRef = await db.collection('userFollows').add({
      uid: currentUser.uid,
      tipsterId: followData.tipsterId,
      pickId: followData.pickId,
      tipsterBookmaker: followData.tipsterBookmaker || '',
      userBookmaker: followData.userBookmaker,
      userOdds: followData.userOdds,
      userStake: followData.userStake,
      userBetType: followData.userBetType,
      userResult: followData.userResult,
      isError: followData.isError || false,
      dateFollowed: followData.dateFollowed,
      isResolved: followData.isResolved,
      profitFromFollow: followData.profitFromFollow,
      commentarios: followData.commentarios || ''
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding follow:', error);
    throw error;
  }
}

async function updateFollowInFirestore(followId, followData) {
  try {
    await db.collection('userFollows').doc(followId).update(followData);
  } catch (error) {
    console.error('Error updating follow:', error);
    throw error;
  }
}

async function deleteFollowFromFirestore(followId) {
  try {
    await db.collection('userFollows').doc(followId).delete();
  } catch (error) {
    console.error('Error deleting follow:', error);
    throw error;
  }
}

function loadSampleData() {
  tipsters = [
    { id: 1, name: 'ProTipster', channel: 'Telegram', createdDate: '2025-01-01', lastPickDate: '2025-11-06' },
    { id: 2, name: 'SportsMaster', channel: 'BlogaBet', createdDate: '2025-01-15', lastPickDate: '2025-11-05' },
    { id: 3, name: 'CornerKing', channel: 'TipsterLand', createdDate: '2025-02-01', lastPickDate: '2025-11-03' }
  ];
  
  picks = [
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

  userFollows = [
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
      commentarios: 'Apostar en diferente casa funcionó bien'
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
      commentarios: 'Cambié la línea pero salió bien'
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
      commentarios: 'La casa cambió la línea'
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
      commentarios: 'Bien apostado'
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
      commentarios: ''
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
      commentarios: 'Error al leer la carrera'
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
      commentarios: 'Buena apuesta'
    }
  ];
  
  nextTipsterId = Math.max(...tipsters.map(t => t.id)) + 1;
  nextPickId = Math.max(...picks.map(p => p.id)) + 1;
  nextFollowId = userFollows.length > 0 ? Math.max(...userFollows.map(f => f.id)) + 1 : 1;
  
  tipsters.forEach(tipster => {
    const tipsterPicks = picks.filter(p => p.tipsterId === tipster.id);
    if (tipsterPicks.length > 0) {
      const dates = tipsterPicks.map(p => new Date(p.date));
      const lastDate = new Date(Math.max(...dates));
      tipster.lastPickDate = lastDate.toISOString().split('T')[0];
    }
  });
  
  renderDashboardPersonalStats();
}

document.getElementById('navbarLogo').addEventListener('click', function() {
  console.log('Navbar logo clicked, showing dashboard view');
  showView('dashboard');
});

function showView(viewName) {
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.classList.remove('active'));
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  if (viewName === 'dashboard') {
    document.getElementById('dashboardView').classList.add('active');
    const tab1 = document.getElementById('tabDashboard');
    const tab2 = document.getElementById('tabDashboard2');
    if (tab1) tab1.classList.add('active');
    if (tab2) tab2.classList.remove('active');
    renderDashboard();
  } else if (viewName === 'allPicks') {
    document.getElementById('allPicksView').classList.add('active');
    const tab1 = document.getElementById('tabAllPicks');
    const tab2 = document.getElementById('tabAllPicks2');
    if (tab1) tab1.classList.remove('active');
    if (tab2) tab2.classList.add('active');
    updateFilterSelects();
    renderAllPicks();
  } else if (viewName === 'misPicks') {
    document.getElementById('misPicksView').classList.add('active');
    renderMisPicks();
  } else if (viewName === 'tipsterDetail') {
    document.getElementById('tipsterDetailView').classList.add('active');
    renderTipsterDetail(currentTipsterId);
  }
  
  currentView = viewName;
}

function showDetailTab(tabName) {
  document.querySelectorAll('.detail-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.detail-tab-content').forEach(content => content.classList.remove('active'));
  
  if (tabName === 'stats') {
    document.querySelectorAll('.detail-tab')[0].classList.add('active');
    document.getElementById('statsTab').classList.add('active');
    document.getElementById('comparisonSection').style.display = 'none';
  } else if (tabName === 'myStats') {
    document.querySelectorAll('.detail-tab')[1].classList.add('active');
    document.getElementById('myStatsTab').classList.add('active');
    renderMyStats(currentTipsterId);
  } else if (tabName === 'follows') {
    document.querySelectorAll('.detail-tab')[2].classList.add('active');
    document.getElementById('followsTab').classList.add('active');
    renderTipsterFollows(currentTipsterId);
    renderFollowComparison(currentTipsterId);
    document.getElementById('comparisonSection').style.display = 'block';
  }
}

function showTipsterDetail(tipsterId) {
  currentTipsterId = tipsterId;
  showView('tipsterDetail');
}

function calculateSeguibilidad(tipsterId) {
  const tipsterPicks = picks.filter(p => p.tipsterId === tipsterId).sort((a, b) => new Date(a.date) - new Date(b.date));
  const tipsterFollows = userFollows.filter(f => f.tipsterId === tipsterId);
  
  if (tipsterFollows.length === 0) {
    return 0;
  }
  
  const followedPickIds = tipsterFollows.map(f => f.pickId);
  const firstFollowedPickIndex = tipsterPicks.findIndex(p => followedPickIds.includes(p.id));
  
  if (firstFollowedPickIndex === -1) {
    return 0;
  }
  
  const picksFromFirstFollow = tipsterPicks.slice(firstFollowedPickIndex);
  const totalPicksSinceFirstFollow = picksFromFirstFollow.length;
  
  const followedCount = picksFromFirstFollow.filter(p => followedPickIds.includes(p.id)).length;
  
  return totalPicksSinceFirstFollow > 0 ? ((followedCount / totalPicksSinceFirstFollow) * 100).toFixed(2) : 0;
}

function calculateStats(tipsterId) {
  const tipsterPicks = picks.filter(p => p.tipsterId === tipsterId);
  const resolvedPicks = tipsterPicks.filter(p => p.isResolved && p.result !== 'Void');
  const wonPicks = resolvedPicks.filter(p => p.result === 'Ganada');
  
  const totalPicks = tipsterPicks.length;
  const winrate = resolvedPicks.length > 0 ? (wonPicks.length / resolvedPicks.length * 100).toFixed(2) : 0;
  
  let totalProfit = 0;
  let totalStaked = 0;
  
  resolvedPicks.forEach(pick => {
    totalStaked += pick.stake;
    if (pick.result === 'Ganada') {
      totalProfit += (pick.odds - 1) * pick.stake;
    } else if (pick.result === 'Perdida') {
      totalProfit -= pick.stake;
    }
  });
  
  const yield_ = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  
  const avgOdds = tipsterPicks.length > 0 
    ? (tipsterPicks.reduce((sum, p) => sum + p.odds, 0) / tipsterPicks.length).toFixed(2)
    : 0;
  
  const avgStake = tipsterPicks.length > 0
    ? (tipsterPicks.reduce((sum, p) => sum + p.stake, 0) / tipsterPicks.length).toFixed(2)
    : 0;
  
  const oddsRanges = {
    '1.00-1.50': tipsterPicks.filter(p => p.odds >= 1.00 && p.odds <= 1.50).length,
    '1.51-2.00': tipsterPicks.filter(p => p.odds > 1.50 && p.odds <= 2.00).length,
    '2.01-3.00': tipsterPicks.filter(p => p.odds > 2.00 && p.odds <= 3.00).length,
    '3.01+': tipsterPicks.filter(p => p.odds > 3.00).length
  };
  
  const oddsDistribution = {};
  Object.keys(oddsRanges).forEach(range => {
    oddsDistribution[range] = tipsterPicks.length > 0
      ? ((oddsRanges[range] / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const stakeDistribution = {};
  for (let i = 1; i <= 10; i++) {
    const count = tipsterPicks.filter(p => p.stake === i).length;
    stakeDistribution[i] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  }
  
  const sportDistribution = {};
  const sports = ['Fútbol', 'Baloncesto', 'Tenis', 'Fútbol Americano', 'Hockey', 'Béisbol', 'Otros'];
  sports.forEach(sport => {
    const count = tipsterPicks.filter(p => p.sport === sport).length;
    sportDistribution[sport] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const pickTypeDistribution = {};
  const types = ['Prematch Simple', 'Combinado', 'Live'];
  types.forEach(type => {
    const count = tipsterPicks.filter(p => p.pickType === type).length;
    pickTypeDistribution[type] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const seguibilidad = calculateSeguibilidad(tipsterId);
  
  return {
    totalPicks,
    winrate,
    yield: yield_,
    avgOdds,
    avgStake,
    totalProfit: totalProfit.toFixed(2),
    oddsDistribution,
    stakeDistribution,
    sportDistribution,
    pickTypeDistribution,
    resolvedCount: resolvedPicks.length,
    wonCount: wonPicks.length,
    seguibilidad: seguibilidad
  };
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

function calculateDashboardPersonalStats() {
  const filteredTipsters = filterTipstersByFilters();
  const filteredTipsterIds = filteredTipsters.map(t => t.id);
  
  const relevantFollows = userFollows.filter(f => filteredTipsterIds.includes(f.tipsterId));
  const resolvedFollows = relevantFollows.filter(f => f.isResolved && f.userResult !== 'Void');
  const wonFollows = resolvedFollows.filter(f => f.userResult === 'Ganada');
  
  const totalFollowed = relevantFollows.length;
  const winrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length * 100).toFixed(2) : 0;
  
  let totalStaked = 0;
  let totalProfit = 0;
  resolvedFollows.forEach(f => {
    totalStaked += f.userStake;
    totalProfit += f.profitFromFollow;
  });
  
  const yield_ = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  const avgOdds = relevantFollows.length > 0 ? (relevantFollows.reduce((sum, f) => sum + f.userOdds, 0) / relevantFollows.length).toFixed(2) : 0;
  const avgStake = relevantFollows.length > 0 ? (relevantFollows.reduce((sum, f) => sum + f.userStake, 0) / relevantFollows.length).toFixed(2) : 0;
  
  const bookmakers = {};
  relevantFollows.forEach(f => {
    if (f.userBookmaker) {
      bookmakers[f.userBookmaker] = (bookmakers[f.userBookmaker] || 0) + 1;
    }
  });
  const favBook = Object.keys(bookmakers).length > 0 ? Object.keys(bookmakers).reduce((a, b) => bookmakers[a] > bookmakers[b] ? a : b) : 'N/A';
  
  const bookmakerProfits = {};
  resolvedFollows.forEach(f => {
    if (f.userBookmaker) {
      bookmakerProfits[f.userBookmaker] = (bookmakerProfits[f.userBookmaker] || 0) + f.profitFromFollow;
    }
  });
  const bestBook = Object.keys(bookmakerProfits).length > 0 ? Object.keys(bookmakerProfits).reduce((a, b) => bookmakerProfits[a] > bookmakerProfits[b] ? a : b) : 'N/A';
  
  return {
    totalFollowed,
    winrate,
    yield: yield_,
    avgOdds,
    avgStake,
    favBook,
    bestBook,
    totalProfit: totalProfit.toFixed(2)
  };
}

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
  
  if (tipsters.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  const filteredTipsters = filterTipstersByFilters();
  
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
      <div class="tipster-card" onclick="showTipsterDetail('${tipster.id}')">
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
            <div class="stat-value" style="color: ${parseFloat(stats.seguibilidad) >= 80 ? 'var(--color-success)' : parseFloat(stats.seguibilidad) >= 50 ? 'var(--color-warning)' : 'var(--color-error)'}">${stats.seguibilidad}%</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAllPicks() {
  const tbody = document.getElementById('allPicksBody');
  
  if (picks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: var(--space-24);">No hay picks registrados</td></tr>';
    return;
  }
  
  const sortedPicks = [...picks].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  tbody.innerHTML = sortedPicks.map(pick => {
    const tipster = tipsters.find(t => t.id === pick.tipsterId);
    const profit = calculatePickProfit(pick);
    const status = pick.status || 'No Seguido';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    
    const sportIcon = sportIcons[pick.sport] || '🎯';
    const displayType = pick.pickType === 'Prematch Simple' ? 'Pre' : pick.pickType;
    return `
      <tr>
        <td>${formatDate(pick.date)}</td>
        <td>${tipster ? tipster.name : 'N/A'}</td>
        <td>${pick.match}</td>
        <td>${sportIcon} ${pick.sport}</td>
        <td>${displayType}</td>
        <td>${pick.betType || 'N/A'}</td>
        <td>${pick.odds.toFixed(2)}</td>
        <td>${pick.stake}</td>
        <td>
          <span class="status-badge ${statusClass}" onclick="togglePickStatus(${pick.id})">${status}</span>
        </td>
        <td><span class="result-badge ${pick.result.toLowerCase()}">${pick.result}</span></td>
        <td><span class="profit ${profit >= 0 ? 'positive' : 'negative'}">${profit > 0 ? '+' : ''}${profit.toFixed(2)}u</span></td>
        <td>
          <button class="action-btn" onclick="editPick(${pick.id})">Editar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterPicks() {
  const tipsterFilter = document.getElementById('filterTipster').value;
  const sportFilter = document.getElementById('filterSport').value;
  const statusFilter = document.getElementById('filterStatus').value;
  const channelFilter = document.getElementById('filterChannel').value;
  const bookmakerFilter = document.getElementById('filterBookmaker').value;
  const resultFilter = document.getElementById('filterResult').value;
  
  let filteredPicks = [...picks];
  
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
      const tipster = tipsters.find(t => t.id === p.tipsterId);
      return tipster && tipster.channel === channelFilter;
    });
  }
  
  if (bookmakerFilter !== 'all') {
    filteredPicks = filteredPicks.filter(p => {
      const follow = userFollows.find(f => f.pickId === p.id);
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
    const tipster = tipsters.find(t => t.id === pick.tipsterId);
    const profit = calculatePickProfit(pick);
    const isFollowed = userFollows.some(f => f.pickId === pick.id);
    
    const status = pick.status || 'No Seguido';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    const sportIcon = sportIcons[pick.sport] || '🎯';
    const displayType = pick.pickType === 'Prematch Simple' ? 'Pre' : pick.pickType;
    
    return `
      <tr>
        <td>${formatDate(pick.date)}</td>
        <td>${tipster ? tipster.name : 'N/A'}</td>
        <td>${pick.match}</td>
        <td>${sportIcon} ${pick.sport}</td>
        <td>${displayType}</td>
        <td>${pick.betType || 'N/A'}</td>
        <td>${pick.odds.toFixed(2)}</td>
        <td>${pick.stake}</td>
        <td>
          <span class="status-badge ${statusClass}" onclick="togglePickStatus(${pick.id})">${status}</span>
        </td>
        <td><span class="result-badge ${pick.result.toLowerCase()}">${pick.result}</span></td>
        <td><span class="profit ${profit >= 0 ? 'positive' : 'negative'}">${profit > 0 ? '+' : ''}${profit.toFixed(2)}u</span></td>
        <td>
          <button class="action-btn" onclick="editPick(${pick.id})">Editar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTipsterDetail(tipsterId) {
  const tipster = tipsters.find(t => t.id === tipsterId);
  if (!tipster) return;
  
  const stats = calculateStats(tipsterId);
  const tipsterPicks = picks.filter(p => p.tipsterId === tipsterId).sort((a, b) => new Date(b.date) - new Date(a.date));
  
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
  
  const seguibilidadEl = document.getElementById('detailSeguibilidad');
  seguibilidadEl.textContent = stats.seguibilidad + '%';
  seguibilidadEl.style.color = parseFloat(stats.seguibilidad) >= 80 ? 'var(--color-success)' : parseFloat(stats.seguibilidad) >= 50 ? 'var(--color-warning)' : 'var(--color-error)';
  
  renderCharts(stats);
  
  const tbody = document.getElementById('detailPicksBody');
  if (tipsterPicks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: var(--space-24);">No hay picks registrados para este tipster</td></tr>';
  } else {
    tbody.innerHTML = tipsterPicks.map(pick => {
      const profit = calculatePickProfit(pick);
      const isFollowed = userFollows.some(f => f.pickId === pick.id);
      const status = pick.status || 'No Seguido';
      const statusClass = status.toLowerCase().replace(/\s+/g, '-');
      const sportIcon = sportIcons[pick.sport] || '🎯';
      const displayType = pick.pickType === 'Prematch Simple' ? 'Pre' : pick.pickType;
      return `
        <tr>
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
            <span class="status-badge ${statusClass}" onclick="togglePickStatus(${pick.id})">${status}</span>
          </td>
          <td>
            <button class="action-btn" onclick="editPick(${pick.id})">Editar</button>
            ${!isFollowed ? `<button class="action-btn" onclick="showFollowPickModal(${pick.id})" style="margin-left: 4px;">Seguir</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }
}

function renderCharts(stats) {
  const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
  
  Object.values(charts).forEach(chart => {
    if (chart) chart.destroy();
  });
  charts = {};
  
  const oddsCtx = document.getElementById('oddsDistChart');
  if (oddsCtx) {
    charts.odds = new Chart(oddsCtx, {
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
    
    charts.stake = new Chart(stakeCtx, {
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
    
    charts.sports = new Chart(sportsCtx, {
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
    
    charts.pickTypes = new Chart(pickTypesCtx, {
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

function showAddTipsterModal() {
  document.getElementById('addTipsterModal').classList.add('active');
  document.getElementById('tipsterName').value = '';
}

function showAddPickModal() {
  if (tipsters.length === 0) {
    alert('Primero debes añadir al menos un tipster');
    return;
  }
  document.getElementById('addPickModal').classList.add('active');
  document.getElementById('addPickForm').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('pickDate').value = today;
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function addTipster(event) {
  event.preventDefault();
  
  const name = document.getElementById('tipsterName').value.trim();
  const channel = document.getElementById('tipsterChannel').value;
  if (!name || !channel) return;
  
  const newTipster = {
    name: name,
    channel: channel,
    createdDate: new Date().toISOString().split('T')[0]
  };
  
  showLoading(true);
  addTipsterToFirestore(newTipster)
    .then(() => {
      closeModal('addTipsterModal');
      document.getElementById('addTipsterForm').reset();
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      alert('Error al añadir tipster: ' + error.message);
    });
}

function togglePickStatus(pickId) {
  editPick(pickId);
}

function addPick(event) {
  event.preventDefault();
  
  const tipsterId = document.getElementById('pickTipster').value;
  const match = document.getElementById('pickMatch').value.trim();
  const betType = document.getElementById('pickBetType').value;
  const sport = document.getElementById('pickSport').value;
  const pickType = document.getElementById('pickType').value;
  const odds = parseFloat(document.getElementById('pickOdds').value);
  const stake = parseInt(document.getElementById('pickStake').value);
  const date = document.getElementById('pickDate').value;
  const result = document.getElementById('pickResult').value;
  const comments = document.getElementById('pickComments').value.trim();
  
  const followed = document.getElementById('pickFollowed').checked;
  
  const newPick = {
    tipsterId: tipsterId,
    match: match,
    sport: sport,
    pickType: pickType,
    betType: betType,
    odds: odds,
    stake: stake,
    date: date,
    result: result,
    isResolved: result !== 'Pendiente',
    comments: comments,
    status: followed ? 'Seguido' : 'No Seguido'
  };
  
  showLoading(true);
  
  addPickToFirestore(newPick)
    .then(pickId => {
      if (followed) {
        const userOdds = parseFloat(document.getElementById('pickUserOdds').value);
        const userStake = parseFloat(document.getElementById('pickUserStake').value);
        const userBetType = document.getElementById('pickUserBetType').value;
        const bookmaker = document.getElementById('pickUserBookmaker').value;
        const userResult = document.getElementById('pickUserResult').value;
        
        if (userOdds && userStake && userBetType && bookmaker) {
          let profitFromFollow = 0;
          if (userResult === 'Ganada') {
            profitFromFollow = (userOdds - 1) * userStake;
          } else if (userResult === 'Perdida') {
            profitFromFollow = -userStake;
          }
          
          const newFollow = {
            tipsterId: tipsterId,
            pickId: pickId,
            userOdds: userOdds,
            userStake: userStake,
            userBetType: userBetType,
            userBookmaker: bookmaker,
            userResult: userResult,
            dateFollowed: date,
            isResolved: userResult !== 'Pendiente',
            profitFromFollow: profitFromFollow
          };
          
          return addFollowToFirestore(newFollow);
        }
      }
      return Promise.resolve();
    })
    .then(() => {
      closeModal('addPickModal');
      document.getElementById('addPickForm').reset();
      document.getElementById('pickFollowed').checked = false;
      document.getElementById('followSection').style.display = 'none';
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('pickDate').value = today;
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      alert('Error al añadir pick: ' + error.message);
    });
}

function editPick(pickId) {
  const pick = picks.find(p => p.id === pickId);
  if (!pick) return;
  
  document.getElementById('editPickId').value = pick.id;
  document.getElementById('editPickMatch').value = pick.match;
  document.getElementById('editPickBetType').value = pick.betType || '';
  document.getElementById('editPickSport').value = pick.sport;
  document.getElementById('editPickType').value = pick.pickType;
  document.getElementById('editPickOdds').value = pick.odds;
  document.getElementById('editPickStake').value = pick.stake;
  document.getElementById('editPickDate').value = pick.date;
  document.getElementById('editPickResult').value = pick.result;
  document.getElementById('editPickComments').value = pick.comments || '';
  
  const follow = userFollows.find(f => f.pickId === pickId);
  if (follow) {
    document.getElementById('editPickFollowed').checked = true;
    document.getElementById('editFollowSection').style.display = 'block';
    document.getElementById('editFollowId').value = follow.id;
    document.getElementById('editPickUserOdds').value = follow.userOdds;
    document.getElementById('editPickUserStake').value = follow.userStake;
    document.getElementById('editPickUserBetType').value = follow.userBetType;
    document.getElementById('editPickUserBookmaker').value = follow.userBookmaker || '';
    document.getElementById('editPickTipsterBookmaker').value = follow.tipsterBookmaker || '';
    document.getElementById('editPickUserResult').value = follow.userResult;
    document.getElementById('editPickIsError').checked = follow.isError || false;
    document.getElementById('editPickFollowComments').value = follow.commentarios || '';
  } else {
    document.getElementById('editPickFollowed').checked = false;
    document.getElementById('editFollowSection').style.display = 'none';
    document.getElementById('editFollowId').value = '';
  }
  
  document.getElementById('editPickModal').classList.add('active');
}

function updatePick(event) {
  event.preventDefault();
  
  const pickId = document.getElementById('editPickId').value;
  const pick = picks.find(p => p.id === pickId);
  if (!pick) return;
  
  const updatedPick = {
    match: document.getElementById('editPickMatch').value.trim(),
    betType: document.getElementById('editPickBetType').value,
    sport: document.getElementById('editPickSport').value,
    pickType: document.getElementById('editPickType').value,
    odds: parseFloat(document.getElementById('editPickOdds').value),
    stake: parseInt(document.getElementById('editPickStake').value),
    date: document.getElementById('editPickDate').value,
    result: document.getElementById('editPickResult').value,
    isResolved: document.getElementById('editPickResult').value !== 'Pendiente',
    comments: document.getElementById('editPickComments').value.trim()
  };
  
  const followed = document.getElementById('editPickFollowed').checked;
  const isError = document.getElementById('editPickIsError').checked;
  const existingFollowId = document.getElementById('editFollowId').value;
  
  showLoading(true);
  
  let promise = updatePickInFirestore(pickId, updatedPick);
  
  if (followed) {
    const userOdds = parseFloat(document.getElementById('editPickUserOdds').value);
    const userStake = parseFloat(document.getElementById('editPickUserStake').value);
    const userBetType = document.getElementById('editPickUserBetType').value;
    const bookmaker = document.getElementById('editPickUserBookmaker').value;
    const userResult = document.getElementById('editPickUserResult').value;
    const tipsterBookmaker = document.getElementById('editPickTipsterBookmaker').value;
    const followComments = document.getElementById('editPickFollowComments').value.trim();
    
    if (userOdds && userStake && userBetType && bookmaker) {
      let profitFromFollow = 0;
      if (userResult === 'Ganada') {
        profitFromFollow = (userOdds - 1) * userStake;
      } else if (userResult === 'Perdida') {
        profitFromFollow = -userStake;
      }
      
      const followData = {
        userOdds: userOdds,
        userStake: userStake,
        userBetType: userBetType,
        userBookmaker: bookmaker,
        tipsterBookmaker: tipsterBookmaker,
        userResult: userResult,
        isError: isError,
        isResolved: userResult !== 'Pendiente',
        profitFromFollow: profitFromFollow,
        commentarios: followComments
      };
      
      updatedPick.status = isError ? 'Error' : 'Seguido';
      
      if (existingFollowId) {
        promise = promise.then(() => updateFollowInFirestore(existingFollowId, followData));
      } else {
        followData.tipsterId = pick.tipsterId;
        followData.pickId = pickId;
        followData.dateFollowed = updatedPick.date;
        promise = promise.then(() => addFollowToFirestore(followData));
      }
    }
  } else if (existingFollowId) {
    updatedPick.status = 'No Seguido';
    promise = promise.then(() => deleteFollowFromFirestore(existingFollowId));
  }
  
  promise = promise.then(() => updatePickInFirestore(pickId, { status: updatedPick.status }));
  
  promise
    .then(() => {
      closeModal('editPickModal');
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      alert('Error al actualizar pick: ' + error.message);
    });
}

function updatePickTipsterSelect() {
  const select = document.getElementById('pickTipster');
  select.innerHTML = '<option value="">Selecciona un tipster</option>' +
    tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function updateFilterSelects() {
  const tipsterFilter = document.getElementById('filterTipster');
  tipsterFilter.innerHTML = '<option value="all">Todos los Tipsters</option>' +
    tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  
  const sports = [...new Set(picks.map(p => p.sport))];
  const sportFilter = document.getElementById('filterSport');
  sportFilter.innerHTML = '<option value="all">Todos los Deportes</option>' +
    sports.map(s => {
      const icon = sportIcons[s] || '🎲';
      return `<option value="${s}">${icon} ${s}</option>`;
    }).join('');
  
  const channels = [...new Set(tipsters.map(t => t.channel))];
  const channelFilter = document.getElementById('filterChannel');
  channelFilter.innerHTML = '<option value="all">Todos los Canales</option>' +
    channels.map(c => `<option value="${c}">${c}</option>`).join('');
  
  const bookmakers = [...new Set(userFollows.map(f => f.userBookmaker).filter(b => b))];
  const bookmakerFilter = document.getElementById('filterBookmaker');
  bookmakerFilter.innerHTML = '<option value="all">Todas las Casas</option>' +
    bookmakers.map(b => `<option value="${b}">${b}</option>`).join('');
}

function updateFollowFilterSelects() {
  const tipsterFilter = document.getElementById('followFilterTipster');
  tipsterFilter.innerHTML = '<option value="all">Todos los Tipsters</option>' +
    tipsters.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function calculatePickProfit(pick) {
  if (!pick.isResolved || pick.result === 'Void') return 0;
  if (pick.result === 'Ganada') {
    return (pick.odds - 1) * pick.stake;
  } else if (pick.result === 'Perdida') {
    return -pick.stake;
  }
  return 0;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function showFollowPickModal(pickId) {
  const pick = picks.find(p => p.id === pickId);
  if (!pick) return;
  
  const tipster = tipsters.find(t => t.id === pick.tipsterId);
  
  document.getElementById('followPickId').value = pick.id;
  document.getElementById('followTipsterId').value = pick.tipsterId;
  document.getElementById('followOdds').value = pick.odds;
  document.getElementById('followStake').value = pick.stake;
  document.getElementById('followBetType').value = pick.betType || '';
  document.getElementById('followResult').value = pick.result;
  
  const info = document.getElementById('followPickInfo');
  info.innerHTML = `
    <h4>Pick del Tipster</h4>
    <div class="info-row">
      <span class="info-label">Tipster:</span>
      <span class="info-value">${tipster ? tipster.name : 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Partido:</span>
      <span class="info-value">${pick.match}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Deporte:</span>
      <span class="info-value">${pick.sport}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Tipo Apuesta:</span>
      <span class="info-value">${pick.betType || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Cuota:</span>
      <span class="info-value">${pick.odds.toFixed(2)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Stake:</span>
      <span class="info-value">${pick.stake}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Resultado:</span>
      <span class="info-value"><span class="result-badge ${pick.result.toLowerCase()}">${pick.result}</span></span>
    </div>
  `;
  
  document.getElementById('followPickModal').classList.add('active');
}

function addFollow(event) {
  event.preventDefault();
  
  const pickId = document.getElementById('followPickId').value;
  const tipsterId = document.getElementById('followTipsterId').value;
  const userOdds = parseFloat(document.getElementById('followOdds').value);
  const userStake = parseFloat(document.getElementById('followStake').value);
  const userBetType = document.getElementById('followBetType').value;
  const bookmaker = document.getElementById('followBookmaker').value;
  const userResult = document.getElementById('followResult').value;
  
  const pick = picks.find(p => p.id === pickId);
  if (!pick) return;
  
  let profitFromFollow = 0;
  if (userResult === 'Ganada') {
    profitFromFollow = (userOdds - 1) * userStake;
  } else if (userResult === 'Perdida') {
    profitFromFollow = -userStake;
  }
  
  const newFollow = {
    tipsterId: tipsterId,
    pickId: pickId,
    userOdds: userOdds,
    userStake: userStake,
    userBetType: userBetType,
    userBookmaker: bookmaker,
    userResult: userResult,
    dateFollowed: pick.date,
    isResolved: userResult !== 'Pendiente',
    profitFromFollow: profitFromFollow
  };
  
  showLoading(true);
  addFollowToFirestore(newFollow)
    .then(() => {
      return updatePickInFirestore(pickId, { status: 'Seguido' });
    })
    .then(() => {
      closeModal('followPickModal');
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      alert('Error al añadir follow: ' + error.message);
    });
}

function renderMisPicks() {
  updateFollowFilterSelects();
  
  const resolvedFollows = userFollows.filter(f => f.isResolved && f.userResult !== 'Void');
  const wonFollows = resolvedFollows.filter(f => f.userResult === 'Ganada');
  
  const totalFollowed = userFollows.length;
  const myWinrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length * 100).toFixed(2) : 0;
  
  let totalStaked = 0;
  let totalProfit = 0;
  resolvedFollows.forEach(f => {
    totalStaked += f.userStake;
    totalProfit += f.profitFromFollow;
  });
  
  const myYield = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  
  document.getElementById('totalFollowed').textContent = totalFollowed;
  document.getElementById('myWinrate').textContent = myWinrate + '%';
  document.getElementById('myYield').textContent = myYield + '%';
  document.getElementById('myProfit').textContent = totalProfit.toFixed(2) + 'u';
  
  filterFollowedPicks();
}

function filterFollowedPicks() {
  const tipsterFilter = document.getElementById('followFilterTipster').value;
  const resultFilter = document.getElementById('followFilterResult').value;
  const matchFilter = document.getElementById('followFilterMatch').value;
  
  let filtered = [...userFollows];
  
  if (tipsterFilter !== 'all') {
    filtered = filtered.filter(f => f.tipsterId === parseInt(tipsterFilter));
  }
  
  if (resultFilter !== 'all') {
    filtered = filtered.filter(f => f.userResult === resultFilter);
  }
  
  if (matchFilter === 'match') {
    filtered = filtered.filter(f => {
      const pick = picks.find(p => p.id === f.pickId);
      return pick && f.userResult === pick.result;
    });
  } else if (matchFilter === 'diverge') {
    filtered = filtered.filter(f => {
      const pick = picks.find(p => p.id === f.pickId);
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
    const pick = picks.find(p => p.id === follow.pickId);
    const tipster = tipsters.find(t => t.id === follow.tipsterId);
    
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
        <td>${follow.bookmaker}</td>
        <td><span class="result-badge ${pick ? pick.result.toLowerCase() : 'pendiente'}">${pick ? pick.result : 'N/A'}</span></td>
        <td><span class="result-badge ${follow.userResult.toLowerCase()}">${follow.userResult}</span></td>
        <td><span class="profit ${follow.profitFromFollow >= 0 ? 'positive' : 'negative'}">${follow.profitFromFollow > 0 ? '+' : ''}${follow.profitFromFollow.toFixed(2)}u</span></td>
        <td>${matchIndicator}</td>
      </tr>
    `;
  }).join('');
}

function renderTipsterFollows(tipsterId) {
  const tipsterFollows = userFollows.filter(f => f.tipsterId === tipsterId);
  const tbody = document.getElementById('tipsterFollowsBody');
  
  if (tipsterFollows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: var(--space-24);">No has seguido picks de este tipster</td></tr>';
    return;
  }
  
  const sortedFollows = tipsterFollows.sort((a, b) => new Date(b.dateFollowed) - new Date(a.dateFollowed));
  
  tbody.innerHTML = sortedFollows.map(follow => {
    const pick = picks.find(p => p.id === follow.pickId);
    
    return `
      <tr>
        <td>${formatDate(follow.dateFollowed)}</td>
        <td>${pick ? pick.match : 'N/A'}</td>
        <td>${follow.userBetType}</td>
        <td>${pick ? pick.odds.toFixed(2) : 'N/A'}</td>
        <td>${follow.userOdds.toFixed(2)}</td>
        <td>${pick ? pick.stake : 'N/A'}</td>
        <td>${follow.userStake}</td>
        <td>${follow.bookmaker}</td>
        <td><span class="result-badge ${pick ? pick.result.toLowerCase() : 'pendiente'}">${pick ? pick.result : 'N/A'}</span></td>
        <td><span class="result-badge ${follow.userResult.toLowerCase()}">${follow.userResult}</span></td>
        <td><span class="profit ${follow.profitFromFollow >= 0 ? 'positive' : 'negative'}">${follow.profitFromFollow > 0 ? '+' : ''}${follow.profitFromFollow.toFixed(2)}u</span></td>
      </tr>
    `;
  }).join('');
}

function renderFollowComparison(tipsterId) {
  const tipsterFollows = userFollows.filter(f => f.tipsterId === tipsterId && f.isResolved && f.userResult !== 'Void');
  
  if (tipsterFollows.length === 0) {
    document.getElementById('comparisonSection').style.display = 'none';
    return;
  }
  
  const followedPickIds = tipsterFollows.map(f => f.pickId);
  const followedPicks = picks.filter(p => followedPickIds.includes(p.id) && p.isResolved && p.result !== 'Void');
  
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
    bookmakers[f.bookmaker] = (bookmakers[f.bookmaker] || 0) + 1;
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
  const tipsterFollows = userFollows.filter(f => f.tipsterId === tipsterId);
  
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
    bookmakers[f.bookmaker] = (bookmakers[f.bookmaker] || 0) + 1;
  });
  
  const bookmakerDistribution = {};
  Object.keys(bookmakers).forEach(bm => {
    bookmakerDistribution[bm] = ((bookmakers[bm] / tipsterFollows.length) * 100).toFixed(2);
  });
  
  let totalOddsDiff = 0;
  let oddsDiffCount = 0;
  tipsterFollows.forEach(f => {
    const pick = picks.find(p => p.id === f.pickId);
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
    const pick = picks.find(p => p.id === f.pickId);
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
  
  if (charts.myOdds) charts.myOdds.destroy();
  if (charts.myStake) charts.myStake.destroy();
  if (charts.myBookmaker) charts.myBookmaker.destroy();
  
  const myOddsCtx = document.getElementById('myOddsDistChart');
  if (myOddsCtx) {
    charts.myOdds = new Chart(myOddsCtx, {
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
    charts.myStake = new Chart(myStakeCtx, {
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
    charts.myBookmaker = new Chart(myBookmakerCtx, {
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

async function confirmResetTipster(tipsterId) {
    const tipster = tipsters.find(t => t.id === tipsterId);
    if (!tipster) return;
    
    const confirmMessage = `⚠️ ATENCIÓN: Vas a resetear "${tipster.name}".\n\n` +
        `Esto eliminará:\n` +
        `- Todos los picks de este tipster\n` +
        `- Todos tus follows de este tipster\n\n` +
        `Esta acción NO se puede deshacer.\n\n` +
        `¿Estás seguro de continuar?`;
    
    if (!confirm(confirmMessage)) return;
    
    const doubleConfirm = confirm(`Última confirmación: ¿Seguro que quieres resetear "${tipster.name}"?`);
    if (!doubleConfirm) return;
    
    await resetTipster(tipsterId);
}

async function resetTipster(tipsterId) {
    showLoading(true);
    
    try {
        const tipsterPicks = picks.filter(p => p.tipsterId === tipsterId);
        const tipsterPickIds = tipsterPicks.map(p => p.id);
        const tipsterFollows = userFollows.filter(f => f.tipsterId === tipsterId);
        const followDeletePromises = tipsterFollows.map(follow => 
            deleteFollowFromFirestore(follow.id)
        );
        await Promise.all(followDeletePromises);
        
        const pickDeletePromises = tipsterPicks.map(pick => 
            deletePickFromFirestore(pick.id)
        );
        await Promise.all(pickDeletePromises);
        
        await updateTipsterInFirestore(tipsterId, { lastPickDate: null });
        
        showLoading(false);
        alert(`✅ Tipster "${tipsters.find(t => t.id === tipsterId)?.name}" reseteado correctamente.\n\nSe eliminaron ${tipsterPicks.length} picks y ${tipsterFollows.length} follows.`);
        
        showView('dashboard');
        
    } catch (error) {
        showLoading(false);
        console.error('Error resetting tipster:', error);
        alert('Error al resetear el tipster: ' + error.message);
    }
}

async function deletePickFromFirestore(pickId) {
    try {
        await db.collection('picks').doc(pickId).delete();
    } catch (error) {
        console.error('Error deleting pick:', error);
        throw error;
    }
}

async function updateTipsterInFirestore(tipsterId, data) {
    try {
        await db.collection('tipsters').doc(tipsterId).update(data);
    } catch (error) {
        console.error('Error updating tipster:', error);
        throw error;
    }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('App loaded, waiting for authentication...');
  lucide.createIcons();
});