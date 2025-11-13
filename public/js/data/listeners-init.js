/**
 * @fileoverview Módulo de listeners de datos en tiempo real
 * @module data/listeners
 */

import { db } from "../core/init.js";
import { state } from "../core/state.js";
import { showLoading, updateFilterSelects, updatePickTipsterSelect } from "../utils/ui-helpers.js";
import { renderAllPicks } from "../views/all-picks.js";
import { renderDashboard, renderDashboardPersonalStats } from "../views/dashboard.js";
import { renderMyPicks } from "../views/my-picks.js";
import { renderTipsterDetail } from "../views/tipster-detail.js";

function setupTipstersListener() {
  if (!state.currentUser) return;

  state.unsubscribeTipsters = db.collection('tipsters')
    .where('uid', '==', state.currentUser.uid)
    .onSnapshot(snapshot => {
      state.tipsters = [];
      snapshot.forEach(doc => {
        state.tipsters.push({ id: doc.id, ...doc.data() });
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
  if (!state.currentUser) return;
  
  state.unsubscribePicks = db.collection('picks')
    .where('uid', '==', state.currentUser.uid)
    .onSnapshot(snapshot => {
      state.picks = [];
      snapshot.forEach(doc => {
        state.picks.push({ id: doc.id, ...doc.data() });
      });
      
      state.tipsters.forEach(tipster => {
        const tipsterPicks = state.picks.filter(p => p.tipsterId === tipster.id);
        if (tipsterPicks.length > 0) {
          const dates = tipsterPicks.map(p => new Date(p.date));
          const lastDate = new Date(Math.max(...dates));
          tipster.lastPickDate = lastDate.toISOString().split('T')[0];
        }
      });
      
      if (state.currentView === 'allPicks') renderAllPicks();
      if (state.currentView === 'tipsterDetail') renderTipsterDetail(state.currentTipsterId);
      if (state.currentView === 'dashboard') renderDashboard();
    }, error => {
      console.error('Error loading picks:', error);
      alert('Error al cargar picks: ' + error.message);
    });
}

function setupFollowsListener() {
  if (!state.currentUser) return;
  
  state.unsubscribeFollows = db.collection('userFollows')
    .where('uid', '==', state.currentUser.uid)
    .onSnapshot(snapshot => {
      state.userFollows = [];
      snapshot.forEach(doc => {
        state.userFollows.push({ id: doc.id, ...doc.data() });
      });
      
      if (state.currentView === 'myPicks') renderMyPicks();
      if (state.currentView === 'tipsterDetail') renderTipsterDetail(state.currentTipsterId);
      renderDashboardPersonalStats();
    }, error => {
      console.error('Error loading follows:', error);
      alert('Error al cargar follows: ' + error.message);
    });
}

export { setupTipstersListener, setupPicksListener, setupFollowsListener };