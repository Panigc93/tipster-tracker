/**
 * Módulo de modal para seleccionar picks.
 * @fileoverview Módulo de modal para seleccionar picks
 * @module pick-modal
 */

import { state } from "../core/state.js";
import { addPick, updatePick } from "../services/pick.service.js";
import { closeModal } from "../utils/ui-helpers.js";
import { addFollow } from "./follow-modal.js";

function showAddPickModal() {
  if (state.tipsters.length === 0) {
    alert('Primero debes añadir al menos un tipster');
    return;
  }
  document.getElementById('addPickModal').classList.add('active');
  document.getElementById('addPickForm').reset();
  const now = new Date();
  document.getElementById('pickDate').value = now.toISOString().split('T')[0];
  document.getElementById('pickTime').value = now.toTimeString().slice(0, 5); // HH:MM
}


function setupPickModalListeners() {
  document.getElementById('addPickForm')?.addEventListener('submit', addPick);
  document.getElementById('editPickForm')?.addEventListener('submit', updatePick);
  document.getElementById('followPickForm')?.addEventListener('submit', addFollow);

  document.getElementById('cancelAddPickModal')?.addEventListener('click', () => closeModal('addPickModal'));
  document.getElementById('cancelEditPickModal')?.addEventListener('click', () => closeModal('editPickModal'));
  document.getElementById('cancelFollowPickModal')?.addEventListener('click', () => closeModal('followPickModal'));

  document.getElementById('closeAddPickModal')?.addEventListener('click', () => closeModal('addPickModal'));
  document.getElementById('closeEditPickModal')?.addEventListener('click', () => closeModal('editPickModal'));
  document.getElementById('closeFollowPickModal')?.addEventListener('click', () => closeModal('followPickModal'));
}

export { showAddPickModal, setupPickModalListeners };