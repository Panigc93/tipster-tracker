/**
 * @fileoverview Repository for UserFollow entity operations
 * @module features/follows/services/follow-repository
 */

import { FirebaseRepository } from '@shared/services/firebase-repository';
import type { UserFollow, CreateFollowDTO, UpdateFollowDTO, OperationResult } from '@shared/types';

/**
 * Repository for managing UserFollow entities in Firestore
 * Extends FirebaseRepository with follow-specific operations
 */
export class FollowRepository extends FirebaseRepository<UserFollow> {
  protected collectionName = 'userFollows';

  /**
   * Create a new follow
   *
   * @param data - Follow data without id/uid
   * @param userId - User ID
   * @returns Operation result with created follow ID
   */
  async createFollow(data: CreateFollowDTO, userId: string): Promise<OperationResult<string>> {
    // Ensure optional fields have default values
    const followData: Omit<UserFollow, 'id' | 'uid'> = {
      ...data,
      isError: data.isError ?? false,
      comments: data.comments ?? '',
    };
    return this.create(followData, userId);
  }

  /**
   * Update a follow
   *
   * @param id - Follow ID
   * @param data - Partial follow data to update
   * @returns Operation result
   */
  async updateFollow(id: string, data: UpdateFollowDTO): Promise<OperationResult> {
    return this.update(id, data);
  }

  /**
   * Delete a follow
   *
   * @param id - Follow ID
   * @returns Operation result
   */
  async deleteFollow(id: string): Promise<OperationResult> {
    return this.delete(id);
  }

  /**
   * Get all follows for a user
   *
   * @param userId - User ID
   * @returns Operation result with array of follows
   */
  async getAllFollows(userId: string): Promise<OperationResult<UserFollow[]>> {
    return this.getByUserId(userId, [this.orderByClause('dateTimeFollowed', 'desc')]);
  }

  /**
   * Get a follow by ID
   *
   * @param id - Follow ID
   * @returns Operation result with follow or null
   */
  async getFollowById(id: string): Promise<OperationResult<UserFollow | null>> {
    return this.getById(id);
  }

  /**
   * Get follows by tipster ID
   *
   * @param userId - User ID
   * @param tipsterId - Tipster ID
   * @returns Operation result with follows for the tipster
   */
  async getFollowsByTipster(userId: string, tipsterId: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('tipsterId', '==', tipsterId),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get follow by pick ID
   *
   * @param userId - User ID
   * @param pickId - Pick ID
   * @returns Operation result with follow or null (should be only one)
   */
  async getFollowByPickId(userId: string, pickId: string): Promise<OperationResult<UserFollow | null>> {
    const result = await this.query(userId, [
      this.whereClause('pickId', '==', pickId),
      this.limitClause(1),
    ]);

    if (!result.success || !result.data || result.data.length === 0) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: result.data[0],
    };
  }

  /**
   * Get resolved follows (follows with a result)
   *
   * @param userId - User ID
   * @returns Operation result with resolved follows
   */
  async getResolvedFollows(userId: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('isResolved', '==', true),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get pending follows (not resolved yet)
   *
   * @param userId - User ID
   * @returns Operation result with pending follows
   */
  async getPendingFollows(userId: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('isResolved', '==', false),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get follows by result
   *
   * @param userId - User ID
   * @param result - Follow result
   * @returns Operation result with follows with specific result
   */
  async getFollowsByResult(userId: string, result: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('userResult', '==', result),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get follows with errors
   *
   * @param userId - User ID
   * @returns Operation result with follows marked as errors
   */
  async getFollowsWithErrors(userId: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('isError', '==', true),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get follows by bookmaker
   *
   * @param userId - User ID
   * @param bookmaker - Bookmaker name
   * @returns Operation result with follows from specific bookmaker
   */
  async getFollowsByBookmaker(userId: string, bookmaker: string): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.whereClause('userBookmaker', '==', bookmaker),
      this.orderByClause('dateTimeFollowed', 'desc'),
    ]);
  }

  /**
   * Get follows by date range
   *
   * @param userId - User ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Operation result with follows in date range
   */
  async getFollowsByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<OperationResult<UserFollow[]>> {
    const result = await this.getAllFollows(userId);

    if (!result.success || !result.data) {
      return result;
    }

    const filtered = result.data.filter(
      (follow) => follow.dateFollowed >= startDate && follow.dateFollowed <= endDate,
    );

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Update follow result
   *
   * @param id - Follow ID
   * @param result - New result
   * @param profitFromFollow - Calculated profit
   * @returns Operation result
   */
  async updateFollowResult(
    id: string,
    result: string,
    profitFromFollow: number,
  ): Promise<OperationResult> {
    return this.update(id, {
      userResult: result,
      isResolved: result !== 'Pendiente',
      profitFromFollow,
    });
  }

  /**
   * Mark follow as error
   *
   * @param id - Follow ID
   * @param isError - Whether it's an error
   * @returns Operation result
   */
  async markFollowAsError(id: string, isError: boolean): Promise<OperationResult> {
    return this.update(id, { isError });
  }

  /**
   * Get recent follows (last N follows)
   *
   * @param userId - User ID
   * @param count - Number of follows to return
   * @returns Operation result with recent follows
   */
  async getRecentFollows(userId: string, count: number): Promise<OperationResult<UserFollow[]>> {
    return this.query(userId, [
      this.orderByClause('dateTimeFollowed', 'desc'),
      this.limitClause(count),
    ]);
  }

  /**
   * Calculate total profit from all follows
   *
   * @param userId - User ID
   * @returns Operation result with total profit
   */
  async getTotalProfit(userId: string): Promise<OperationResult<number>> {
    const result = await this.getResolvedFollows(userId);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const totalProfit = result.data.reduce((sum, follow) => sum + follow.profitFromFollow, 0);

    return {
      success: true,
      data: totalProfit,
    };
  }

  /**
   * Delete all follows for a tipster
   * Used when resetting or deleting a tipster
   *
   * @param userId - User ID
   * @param tipsterId - Tipster ID
   * @returns Operation result with number of deleted follows
   */
  async deleteFollowsByTipster(userId: string, tipsterId: string): Promise<OperationResult<number>> {
    const result = await this.getFollowsByTipster(userId, tipsterId);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const deletePromises = result.data.map((follow) => this.deleteFollow(follow.id));
    const results = await Promise.all(deletePromises);

    const successCount = results.filter((r) => r.success).length;

    return {
      success: true,
      data: successCount,
    };
  }

  /**
   * Delete follow by pick ID
   * Used when deleting a pick
   *
   * @param userId - User ID
   * @param pickId - Pick ID
   * @returns Operation result
   */
  async deleteFollowByPickId(userId: string, pickId: string): Promise<OperationResult> {
    const result = await this.getFollowByPickId(userId, pickId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    if (!result.data) {
      // No follow exists, that's ok
      return { success: true };
    }

    return this.deleteFollow(result.data.id);
  }
}

// Export singleton instance
export const followRepository = new FollowRepository();
