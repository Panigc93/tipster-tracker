/**
 * Muestra el modal para seguir un pick de un tipster.
 * Rellena los campos del formulario con los datos del pick y del tipster.
 * /**
 * @fileoverview Módulo de modal para seguir picks 
 * @module follow-modal
 * @param {string} pickId - ID del pick a seguir.
 */

import { state } from "../core/state.js";
import { addFollowToFirestore } from "../services/follow.service.js";
import { updatePickInFirestore } from "../services/pick.service.js";
import { closeModal, showLoading } from "../utils/ui-helpers.js";

function showFollowPickModal(pickId) {
  const pick = state.picks.find(p => p.id === pickId);
  if (!pick) return;

  const tipster = state.tipsters.find(t => t.id === pick.tipsterId);

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
  
  const now = new Date();
  document.getElementById('followUserDate').value = now.toISOString().split('T')[0];
  document.getElementById('followUserTime').value = now.toTimeString().slice(0, 5);

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
  const userDate = document.getElementById('followUserDate').value;
  const userTime = document.getElementById('followUserTime').value;

  const pick = state.picks.find(p => p.id === pickId);
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
    dateFollowed: userDate,
    timeFollowed: userTime,
    dateTimeFollowed: `${userDate}T${userTime}:00`,
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


export { showFollowPickModal, addFollow };