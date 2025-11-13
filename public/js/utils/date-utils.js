/**
 * @fileoverview Módulo de utilidades para manejo de fechas
 * @param {string} dateString 
 */

import { state } from "../core/state.js";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getLastPickDate(tipsterId) {
  const tipsterPicks = state.picks.filter(p => p.tipsterId === tipsterId);
  if (tipsterPicks.length === 0) return null;
  
  const dates = tipsterPicks.map(p => new Date(p.date));
  return new Date(Math.max(...dates));
}
    
export { formatDate, getLastPickDate };