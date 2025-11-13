/**
 * @fileoverview Módulo de estado global de la aplicación
 * @module core/state
 */

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

export { state };
