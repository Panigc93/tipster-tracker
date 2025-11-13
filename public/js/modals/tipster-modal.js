/**
 * Muestra el modal para añadir un nuevo tipster.
 * Limpia los campos del formulario para una nueva entrada.
 * @fileoverview Módulo de modal para añadir tipsters
 * @module tipster-modal
 */
import { addTipster } from "../services/tipster.service.js";
import { closeModal } from "../utils/ui-helpers.js";

function showAddTipsterModal() {
  document.getElementById('addTipsterModal').classList.add('active');
  document.getElementById('tipsterName').value = '';
}

function setupTipsterModalListeners() {
  document.getElementById('addTipsterForm')?.addEventListener('submit', addTipster);

  document.getElementById('closeAddTipsterModal')?.addEventListener('click', () => closeModal('addTipsterModal'));
  document.getElementById('cancelAddTipsterModal')?.addEventListener('click', () => closeModal('addTipsterModal'));
  document.getElementById('showAddTipsterModalBtn')?.addEventListener('click', showAddTipsterModal);
}
export { showAddTipsterModal, setupTipsterModalListeners };