/**
 * @fileoverview Módulo de servicio para gestionar los tipsters en Firestore
 * @module tipster-service
 * @param {*} tipsterData 
 */

import { db } from "../core/init.js";
import { state } from "../core/state.js";
import { closeModal, showLoading } from "../utils/ui-helpers.js";

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


async function addTipsterToFirestore(tipsterData) {
  try {
    const docRef = await db.collection('tipsters').add({
      uid:  state.currentUser.uid,
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

async function updateTipsterInFirestore(tipsterId, data) {
    try {
        await db.collection('tipsters').doc(tipsterId).update(data);
    } catch (error) {
        console.error('Error updating tipster:', error);
        throw error;
    }
}

async function confirmResetTipster(tipsterId) {
    const tipster = state.tipsters.find(t => t.id === tipsterId);
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
        const tipsterPicks = state.picks.filter(p => p.tipsterId === tipsterId);
        const tipsterPickIds = tipsterPicks.map(p => p.id);
        const tipsterFollows = state.userFollows.filter(f => f.tipsterId === tipsterId);
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
        alert(`✅ Tipster "${state.tipsters.find(t => t.id === tipsterId)?.name}" reseteado correctamente.\n\nSe eliminaron ${tipsterPicks.length} picks y ${tipsterFollows.length} follows.`);
        
        showView('dashboard');
        
    } catch (error) {
        showLoading(false);
        console.error('Error resetting tipster:', error);
        alert('Error al resetear el tipster: ' + error.message);
    }
}

export { addTipster, addTipsterToFirestore, updateTipsterInFirestore, confirmResetTipster };