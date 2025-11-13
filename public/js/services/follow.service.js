/**
 * 
 * @fileoverview Módulo de servicio para gestionar los follows en Firestore
 * @module follow-service
 * @param {Object} followData - Datos del follow a añadir o actualizar.
 */

import { db } from "../core/init.js";
import { state } from "../core/state.js";

async function addFollowToFirestore(followData) {
  try {
    const docRef = await db.collection('userFollows').add({
      uid: state.currentUser.uid,
      tipsterId: followData.tipsterId,
      pickId: followData.pickId,
      userBookmaker: followData.userBookmaker,
      userOdds: followData.userOdds,
      userStake: followData.userStake,
      userBetType: followData.userBetType,
      userResult: followData.userResult,
      isError: followData.isError || false,
      dateFollowed: followData.dateFollowed,
      timeFollowed: followData.timeFollowed,
      dateTimeFollowed: followData.dateTimeFollowed,
      isResolved: followData.isResolved,
      profitFromFollow: followData.profitFromFollow,
      comments: followData.comments || ''
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

export { addFollowToFirestore, updateFollowInFirestore, deleteFollowFromFirestore };