/**
 * @fileoverview Repository for Pick entity operations
 * @module features/picks/services/pick-repository
 */

import { FirebaseRepository } from '@shared/services/firebase-repository';
import type { Pick, CreatePickDTO, UpdatePickDTO, OperationResult } from '@shared/types';
import type { PickResult } from '@shared/types/enums';

/**
 * Repository for managing Pick entities in Firestore
 * Extends FirebaseRepository with pick-specific operations
 */
export class PickRepository extends FirebaseRepository<Pick> {
  protected collectionName = 'picks';

  /**
   * Create a new pick
   *
   * @param data - Pick data without id/uid
   * @param userId - User ID
   * @returns Operation result with created pick ID
   */
  async createPick(data: CreatePickDTO, userId: string): Promise<OperationResult<string>> {
    // Ensure optional fields have default values
    const pickData: Omit<Pick, 'id' | 'uid'> = {
      ...data,
      comments: data.comments ?? '',
      status: data.status,
    };
    return this.create(pickData, userId);
  }

  /**
   * Update a pick
   *
   * @param id - Pick ID
   * @param data - Partial pick data to update
   * @returns Operation result
   */
  async updatePick(id: string, data: UpdatePickDTO): Promise<OperationResult> {
    return this.update(id, data);
  }

  /**
   * Delete a pick
   *
   * @param id - Pick ID
   * @returns Operation result
   */
  async deletePick(id: string): Promise<OperationResult> {
    return this.delete(id);
  }

  /**
   * Get all picks for a user
   *
   * @param userId - User ID
   * @returns Operation result with array of picks
   */
  async getAllPicks(userId: string): Promise<OperationResult<Pick[]>> {
    return this.getByUserId(userId, [this.orderByClause('dateTime', 'desc')]);
  }

  /**
   * Get a pick by ID
   *
   * @param id - Pick ID
   * @returns Operation result with pick or null
   */
  async getPickById(id: string): Promise<OperationResult<Pick | null>> {
    return this.getById(id);
  }

  /**
   * Get picks by tipster ID
   *
   * @param userId - User ID
   * @param tipsterId - Tipster ID
   * @returns Operation result with picks for the tipster
   */
  async getPicksByTipster(userId: string, tipsterId: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('tipsterId', '==', tipsterId),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get picks by sport
   *
   * @param userId - User ID
   * @param sport - Sport name
   * @returns Operation result with picks for the sport
   */
  async getPicksBySport(userId: string, sport: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('sport', '==', sport),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get resolved picks (picks with a result)
   *
   * @param userId - User ID
   * @returns Operation result with resolved picks
   */
  async getResolvedPicks(userId: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('isResolved', '==', true),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get pending picks (not resolved yet)
   *
   * @param userId - User ID
   * @returns Operation result with pending picks
   */
  async getPendingPicks(userId: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('isResolved', '==', false),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get picks by result
   *
   * @param userId - User ID
   * @param result - Pick result
   * @returns Operation result with picks with specific result
   */
  async getPicksByResult(userId: string, result: PickResult): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('result', '==', result),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get picks by date range
   *
   * @param userId - User ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Operation result with picks in date range
   */
  async getPicksByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<OperationResult<Pick[]>> {
    const result = await this.getAllPicks(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter((pick) => pick.date >= startDate && pick.date <= endDate);

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get picks by bookmaker
   *
   * @param userId - User ID
   * @param bookmaker - Bookmaker name
   * @returns Operation result with picks from specific bookmaker
   */
  async getPicksByBookmaker(userId: string, bookmaker: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('bookmaker', '==', bookmaker),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Get recent picks (last N picks)
   *
   * @param userId - User ID
   * @param count - Number of picks to return
   * @returns Operation result with recent picks
   */
  async getRecentPicks(userId: string, count: number): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [this.orderByClause('dateTime', 'desc'), this.limitClause(count)]);
  }

  /**
   * Update pick result
   *
   * @param id - Pick ID
   * @param result - New result
   * @returns Operation result
   */
  async updatePickResult(id: string, result: PickResult): Promise<OperationResult> {
    return this.update(id, {
      result,
      isResolved: result !== 'Pendiente',
    });
  }

  /**
   * Get picks by pick type
   *
   * @param userId - User ID
   * @param pickType - Pick type (Pre, Live, Combinado)
   * @returns Operation result with picks of specific type
   */
  async getPicksByType(userId: string, pickType: string): Promise<OperationResult<Pick[]>> {
    return this.query(userId, [
      this.whereClause('pickType', '==', pickType),
      this.orderByClause('dateTime', 'desc'),
    ]);
  }

  /**
   * Search picks by match name (client-side filtering)
   *
   * @param userId - User ID
   * @param searchTerm - Search term
   * @returns Operation result with matching picks
   */
  async searchPicksByMatch(userId: string, searchTerm: string): Promise<OperationResult<Pick[]>> {
    const result = await this.getAllPicks(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter((pick) =>
      pick.match.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get picks with minimum odds
   *
   * @param userId - User ID
   * @param minOdds - Minimum odds value
   * @returns Operation result with picks above min odds
   */
  async getPicksByMinOdds(userId: string, minOdds: number): Promise<OperationResult<Pick[]>> {
    const result = await this.getAllPicks(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter((pick) => pick.odds >= minOdds);

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get picks by stake range
   *
   * @param userId - User ID
   * @param minStake - Minimum stake
   * @param maxStake - Maximum stake
   * @returns Operation result with picks in stake range
   */
  async getPicksByStakeRange(
    userId: string,
    minStake: number,
    maxStake: number,
  ): Promise<OperationResult<Pick[]>> {
    const result = await this.getAllPicks(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter((pick) => pick.stake >= minStake && pick.stake <= maxStake);

    return {
      success: true,
      data: filtered,
    };
  }
}

// Export singleton instance
export const pickRepository = new PickRepository();
