/**
 * Módulo de vista para mis picks seguidos.
 * @fileoverview Módulo de vista para mis picks seguidos
 * @module views/my-picks
 */

import { updateFollowFilterSelects } from "../utils/ui-helpers.js";

function renderMyPicks() {
  updateFollowFilterSelects();

  const resolvedFollows = state.userFollows.filter(f => f.isResolved && f.userResult !== 'Void');
  const wonFollows = resolvedFollows.filter(f => f.userResult === 'Ganada');

  const totalFollowed = state.userFollows.length;
  const myWinrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length * 100).toFixed(2) : 0;
  
  let totalStaked = 0;
  let totalProfit = 0;
  resolvedFollows.forEach(f => {
    totalStaked += f.userStake;
    totalProfit += f.profitFromFollow;
  });
  
  const myYield = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  
  document.getElementById('totalFollowed').textContent = totalFollowed;
  document.getElementById('myWinrate').textContent = myWinrate + '%';
  document.getElementById('myYield').textContent = myYield + '%';
  document.getElementById('myProfit').textContent = totalProfit.toFixed(2) + 'u';
  
  filterFollowedPicks();
}

export { renderMyPicks };