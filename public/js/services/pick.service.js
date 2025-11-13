/**
 * Módulo de servicio para gestionar los picks en Firestore
 * @fileoverview Módulo de servicio para gestionar los picks en Firestore
 * @module pick-service
 * @param {Object} pickData - Datos del pick a añadir o actualizar.
 */

import { db } from "../core/init.js";
import { state } from "../core/state.js";
import { closeModal, showLoading } from "../utils/ui-helpers.js";
import { addFollowToFirestore, deleteFollowFromFirestore, updateFollowInFirestore } from "./follow.service.js";

function addPick(event) {
  event.preventDefault();
  
  const tipsterId = document.getElementById('pickTipster').value;
  const match = document.getElementById('pickMatch').value.trim();
  const betType = document.getElementById('pickBetType').value;
  const bookmaker = document.getElementById('pickTipsterBookmaker').value;
  const sport = document.getElementById('pickSport').value;
  const pickType = document.getElementById('pickType').value;
  const odds = parseFloat(document.getElementById('pickOdds').value);
  const stake = parseInt(document.getElementById('pickStake').value);
  const date = document.getElementById('pickDate').value;
  const time = document.getElementById('pickTime').value;
  const result = document.getElementById('pickResult').value;
  const comments = document.getElementById('pickComments').value.trim();
  const followed = document.getElementById('pickFollowed').checked;
  const dateTime = `${date}T${time}:00`;
  
  const newPick = {
    tipsterId: tipsterId,
    match: match,
    sport: sport,
    pickType: pickType,
    betType: betType,
    bookmaker: bookmaker,
    odds: odds,
    stake: stake,
    date: date,
    time: time,
    dateTime: dateTime,
    result: result,
    isResolved: result !== 'Pendiente',
    comments: comments,
    status: followed ? 'Seguido' : 'No Seguido'
  };
  console.log('Adding pick:', newPick);
  
  showLoading(true);
  
  addPickToFirestore(newPick)
    .then(pickId => {
      if (followed) {
        const userOdds = parseFloat(document.getElementById('pickUserOdds').value);
        const userStake = parseFloat(document.getElementById('pickUserStake').value);
        const userBetType = document.getElementById('pickUserBetType').value;
        const userBookmaker = document.getElementById('pickUserBookmaker').value;
        const userResult = document.getElementById('pickUserResult').value;
        const userDate = document.getElementById('pickUserDate').value || date;
        const userTime = document.getElementById('pickUserTime').value || time;
        const userDateTime = `${userDate}T${userTime}:00`;

        if (userOdds && userStake && userBetType && userBookmaker) {
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
            userBookmaker: userBookmaker,
            userResult: userResult,
            dateFollowed: userDate,
            timeFollowed: userTime,
            dateTimeFollowed: userDateTime,
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
      const now = new Date();
      document.getElementById('pickDate').value = now.toISOString().split('T')[0];
      document.getElementById('pickTime').value = now.toTimeString().slice(0, 5);
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      alert('Error al añadir pick: ' + error.message);
    });
}

function editPick(pickId) {
  const pick = state.picks.find(p => p.id === pickId);
  if (!pick) return;
  console.log('Editing pick:', pick);
  
  document.getElementById('editPickId').value = pick.id;
  document.getElementById('editPickMatch').value = pick.match;
  document.getElementById('editPickBetType').value = pick.betType || '';
  document.getElementById('editPickTipsterBookmaker').value = pick.bookmaker || '';
  document.getElementById('editPickSport').value = pick.sport;
  document.getElementById('editPickType').value = pick.pickType;
  document.getElementById('editPickOdds').value = pick.odds;
  document.getElementById('editPickStake').value = pick.stake;
  document.getElementById('editPickDate').value = pick.date;
  document.getElementById('editPickTime').value = pick.time;
  document.getElementById('editPickResult').value = pick.result;
  document.getElementById('editPickComments').value = pick.comments || '';

  const follow = state.userFollows.find(f => f.pickId === pickId);
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
    document.getElementById('editPickUserDate').value = follow.dateFollowed || pick.date;
    document.getElementById('editPickUserTime').value = follow.timeFollowed || pick.time;
    document.getElementById('editPickIsError').checked = follow.isError || false;
    document.getElementById('editPickFollowComments').value = follow.comments || '';
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
    const pick = state.picks.find(p => p.id === pickId);
    
    if (!pick) return;
    
    const followed = document.getElementById('editPickFollowed').checked;
    const isError = document.getElementById('editPickIsError').checked;
    const existingFollowId = document.getElementById('editFollowId').value;
    
    let pickStatus = 'No Seguido';
    if (followed) {
        pickStatus = isError ? 'Error' : 'Seguido';
    } else if (existingFollowId) {
        pickStatus = 'No Seguido';
    } else {
        pickStatus = pick.status || 'No Seguido';
    }
    
    const updatedPick = {
        match: document.getElementById('editPickMatch').value.trim(),
        betType: document.getElementById('editPickBetType').value,
        sport: document.getElementById('editPickSport').value,
        pickType: document.getElementById('editPickType').value,
        bookmaker: document.getElementById('editPickTipsterBookmaker').value,
        odds: parseFloat(document.getElementById('editPickOdds').value),
        stake: parseInt(document.getElementById('editPickStake').value),
        date: document.getElementById('editPickDate').value,
        time: document.getElementById('editPickTime').value || '12:00',
        dateTime: `${document.getElementById('editPickDate').value}T${document.getElementById('editPickTime').value || '12:00'}:00`,
        result: document.getElementById('editPickResult').value,
        isResolved: document.getElementById('editPickResult').value !== 'Pendiente',
        comments: document.getElementById('editPickComments').value.trim(),
        status: pickStatus
    };
    
    showLoading(true);
    
    let promise = updatePickInFirestore(pickId, updatedPick);
    
    if (followed) {
        const userOdds = parseFloat(document.getElementById('editPickUserOdds').value);
        const userStake = parseFloat(document.getElementById('editPickUserStake').value);
        const userBetType = document.getElementById('editPickUserBetType').value;
        const bookmaker = document.getElementById('editPickUserBookmaker').value;
        const userResult = document.getElementById('editPickUserResult').value;
        const userDate = document.getElementById('editPickUserDate').value || updatedPick.date;
        const userTime = document.getElementById('editPickUserTime').value || updatedPick.time;
        const userDateTime = `${userDate}T${userTime}:00`;
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
                userResult: userResult,
                dateFollowed: userDate,
                timeFollowed: userTime,
                dateTimeFollowed: userDateTime,
                isError: isError,
                isResolved: userResult !== 'Pendiente',
                profitFromFollow: profitFromFollow,
                comments: followComments
            };
            
            if (existingFollowId) {
                promise = promise.then(() => updateFollowInFirestore(existingFollowId, followData));
            } else {
                followData.tipsterId = pick.tipsterId;
                followData.pickId = pickId;
                promise = promise.then(() => addFollowToFirestore(followData));
            }
        }
    } else if (existingFollowId) {
        promise = promise.then(() => deleteFollowFromFirestore(existingFollowId));
    }
    
    promise
        .then(() => {
            closeModal('editPickModal');
            showLoading(false);
        })
        .catch((error) => {
            showLoading(false);
            alert('Error al actualizar pick: ' + error.message);
        });
}

async function addPickToFirestore(pickData) {
  try {
    const docRef = await db.collection('picks').add({
      uid: state.currentUser.uid,
      tipsterId: pickData.tipsterId,
      sport: pickData.sport,
      odds: pickData.odds,
      stake: pickData.stake,
      pickType: pickData.pickType,
      betType: pickData.betType,
      bookmaker: pickData.bookmaker,
      date: pickData.date,
      time: pickData.time,
      dateTime: pickData.dateTime,   
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
async function deletePickFromFirestore(pickId) {
    try {
        await db.collection('picks').doc(pickId).delete();
    } catch (error) {
        console.error('Error deleting pick:', error);
        throw error;
    }
}

export { addPick,editPick, updatePick, addPickToFirestore, updatePickInFirestore, deletePickFromFirestore };