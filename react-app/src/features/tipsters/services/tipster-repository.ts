/**
 * @fileoverview Repository for Tipster entity operations
 * @module features/tipsters/services/tipster-repository
 */

import { FirebaseRepository } from '@shared/services/firebase-repository';
import type { Tipster, CreateTipsterDTO, UpdateTipsterDTO, OperationResult } from '@shared/types';

/**
 * Repository for managing Tipster entities in Firestore
 * Extends FirebaseRepository with tipster-specific operations
 */
export class TipsterRepository extends FirebaseRepository<Tipster> {
  protected collectionName = 'tipsters';

  /**
   * Create a new tipster
   *
   * @param data - Tipster data without id/uid
   * @param userId - User ID
   * @returns Operation result with created tipster ID
   */
  async createTipster(data: CreateTipsterDTO, userId: string): Promise<OperationResult<string>> {
    // Ensure lastPickDate is explicitly null if not provided
    const tipsterData: Omit<Tipster, 'id' | 'uid'> = {
      ...data,
      lastPickDate: data.lastPickDate ?? null,
    };
    return this.create(tipsterData, userId);
  }

  /**
   * Update a tipster
   *
   * @param id - Tipster ID
   * @param data - Partial tipster data to update
   * @returns Operation result
   */
  async updateTipster(id: string, data: UpdateTipsterDTO): Promise<OperationResult> {
    return this.update(id, data);
  }

  /**
   * Delete a tipster
   *
   * @param id - Tipster ID
   * @returns Operation result
   */
  async deleteTipster(id: string): Promise<OperationResult> {
    return this.delete(id);
  }

  /**
   * Get all tipsters for a user
   *
   * @param userId - User ID
   * @returns Operation result with array of tipsters
   */
  async getAllTipsters(userId: string): Promise<OperationResult<Tipster[]>> {
    return this.getByUserId(userId);
  }

  /**
   * Get a tipster by ID
   *
   * @param id - Tipster ID
   * @returns Operation result with tipster or null
   */
  async getTipsterById(id: string): Promise<OperationResult<Tipster | null>> {
    return this.getById(id);
  }

  /**
   * Get tipsters by channel
   *
   * @param userId - User ID
   * @param channel - Channel name
   * @returns Operation result with filtered tipsters
   */
  async getTipstersByChannel(userId: string, channel: string): Promise<OperationResult<Tipster[]>> {
    return this.query(userId, [this.whereClause('channel', '==', channel)]);
  }

  /**
   * Search tipsters by name (contains)
   *
   * @param userId - User ID
   * @param searchTerm - Search term (case-sensitive, starts with)
   * @returns Operation result with matching tipsters
   */
  async searchTipstersByName(userId: string, searchTerm: string): Promise<OperationResult<Tipster[]>> {
    // Firestore doesn't support full text search or contains
    // We'll fetch all and filter client-side (better solution: use Algolia or similar)
    const result = await this.getAllTipsters(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter((tipster) =>
      tipster.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get tipsters sorted by name
   *
   * @param userId - User ID
   * @param direction - Sort direction
   * @returns Operation result with sorted tipsters
   */
  async getTipstersSortedByName(
    userId: string,
    direction: 'asc' | 'desc' = 'asc',
  ): Promise<OperationResult<Tipster[]>> {
    return this.query(userId, [this.orderByClause('name', direction)]);
  }

  /**
   * Update tipster's last pick date
   * Useful when adding/removing picks
   *
   * @param id - Tipster ID
   * @param lastPickDate - Last pick date in YYYY-MM-DD format, or null
   * @returns Operation result
   */
  async updateLastPickDate(id: string, lastPickDate: string | null): Promise<OperationResult> {
    return this.update(id, { lastPickDate });
  }

  /**
   * Get tipsters with recent activity (last pick within N days)
   *
   * @param userId - User ID
   * @param days - Number of days to look back
   * @returns Operation result with active tipsters
   */
  async getActiveTipsters(userId: string, days: number): Promise<OperationResult<Tipster[]>> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const result = await this.getAllTipsters(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter(
      (tipster) => tipster.lastPickDate && tipster.lastPickDate >= cutoffDateStr,
    );

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get inactive tipsters (no picks or old last pick)
   *
   * @param userId - User ID
   * @param days - Number of days threshold
   * @returns Operation result with inactive tipsters
   */
  async getInactiveTipsters(userId: string, days: number): Promise<OperationResult<Tipster[]>> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const result = await this.getAllTipsters(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter(
      (tipster) => !tipster.lastPickDate || tipster.lastPickDate < cutoffDateStr,
    );

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Reset tipster (remove lastPickDate)
   * Note: This doesn't delete associated picks/follows - that should be done separately
   *
   * @param id - Tipster ID
   * @returns Operation result
   */
  async resetTipster(id: string): Promise<OperationResult> {
    return this.updateLastPickDate(id, null);
  }
}

// Export singleton instance
export const tipsterRepository = new TipsterRepository();
