/**
 * @fileoverview Módulo de inicialización de Firebase y variables globales
 * @module core/init
 */

// Firebase
let auth, db;

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

const state = {
  currentUser: null,
  unsubscribeTipsters: null,
  unsubscribePicks: null,
  unsubscribeFollows: null,
  tipsters: [],
  picks: [],
  userFollows: [],
  currentView: 'dashboard',
  currentTipsterId: null,
  nextTipsterId: 1,
  nextPickId: 1,
  nextFollowId: 1,
  charts: {},
  dashboardFilters: {
    sports: [],
    channels: [],
    yieldMin: -1000,
    lastPickDays: 'all',
    sortBy: 'yield',
    searchQuery: ''
  },
  yieldDebounceTimer: null
};

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
  'Tenis de mesa': '🏓',
  'Otro': '🎲'
};

const allSports = ['Fútbol', 'Baloncesto', 'Tenis', 'Fútbol Americano', 'Hockey', 'Béisbol', 'Dardos', 'Caballos', 'Motor', 'Esports', 'Fórmula 1', 'Golf', 'Rugby', 'Cricket', 'Tenis de mesa', 'Otro'];

const allChannels = ['BlogaBet', 'Telegram', 'TipsterLand', 'Twitter/X', 'Discord', 'Otro'];

const allBookmakers = ['1xBet', 'Betfair', 'Bet365', 'William Hill', 'Marathonbet', '888', 'Bwin','Codere', 'Luckia', 'Sportium', 'Betsson', 'Betway', 'Interwetten','Kirolbet', 'Casumo', 'LeoVegas', 'Winamax', 'Paf', 'Pastón', 'Olybet','TonyBet', 'Marca Apuestas', 'Suertia', 'Yaas', 'Versus', 'Retabet','Opabets', 'Otro'];

export {
  auth,
  db,
  state,
  sportIcons,
  allSports,
  allChannels,
  allBookmakers
};
