/**
 * @fileoverview Base abstract repository for Firebase Firestore operations
 * @module shared/services/firebase-repository
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
  orderBy,
  limit,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import type { FirestoreDocument, OperationResult, AppError } from '@shared/types';

/**
 * Abstract base repository for Firestore operations
 * Implements generic CRUD operations with error handling
 *
 * @template T - Type that extends FirestoreDocument (must have id and uid)
 */
export abstract class FirebaseRepository<T extends FirestoreDocument> {
  /**
   * Collection name in Firestore
   */
  protected abstract collectionName: string;

  /**
   * Get the Firestore collection reference
   */
  protected getCollection() {
    return collection(db, this.collectionName);
  }

  /**
   * Create a new document in Firestore
   *
   * @param data - Data to create (without id, uid will be added)
   * @param userId - User ID to associate with the document
   * @returns Operation result with the created document ID
   */
  async create(
    data: Omit<T, 'id' | 'uid'>,
    userId: string,
  ): Promise<OperationResult<string>> {
    try {
      const docData = {
        ...data,
        uid: userId,
      } as DocumentData;

      const docRef = await addDoc(this.getCollection(), docData);

      return {
        success: true,
        data: docRef.id,
      };
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Get a document by ID
   *
   * @param id - Document ID
   * @returns Operation result with the document or null if not found
   */
  async getById(id: string): Promise<OperationResult<T | null>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: true,
          data: null,
        };
      }

      const data = {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Get all documents for a user
   *
   * @param userId - User ID to filter by
   * @param constraints - Additional query constraints (orderBy, limit, etc.)
   * @returns Operation result with array of documents
   */
  async getByUserId(
    userId: string,
    constraints: QueryConstraint[] = [],
  ): Promise<OperationResult<T[]>> {
    try {
      const q = query(
        this.getCollection(),
        where('uid', '==', userId),
        ...constraints,
      );

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];

      for (const docSnap of querySnapshot.docs) {
        documents.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as T);
      }

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Update a document by ID
   *
   * @param id - Document ID
   * @param data - Partial data to update
   * @returns Operation result
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'uid'>>): Promise<OperationResult> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data as DocumentData);

      return {
        success: true,
      };
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Delete a document by ID
   *
   * @param id - Document ID
   * @returns Operation result
   */
  async delete(id: string): Promise<OperationResult> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      return {
        success: true,
      };
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Custom query method for advanced filtering
   *
   * @param userId - User ID to filter by
   * @param constraints - Query constraints (where, orderBy, limit, etc.)
   * @returns Operation result with array of documents
   */
  async query(
    userId: string,
    constraints: QueryConstraint[] = [],
  ): Promise<OperationResult<T[]>> {
    try {
      const q = query(
        this.getCollection(),
        where('uid', '==', userId),
        ...constraints,
      );

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];

      for (const docSnap of querySnapshot.docs) {
        documents.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as T);
      }

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      console.error(`Error querying ${this.collectionName}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Helper method to build where clauses
   *
   * @param field - Field name
   * @param operator - Comparison operator
   * @param value - Value to compare
   * @returns QueryConstraint for where clause
   */
  protected whereClause(field: string, operator: WhereFilterOp, value: unknown) {
    return where(field, operator, value);
  }

  /**
   * Helper method to build orderBy clauses
   *
   * @param field - Field name
   * @param direction - Sort direction
   * @returns QueryConstraint for orderBy clause
   */
  protected orderByClause(field: string, direction: 'asc' | 'desc' = 'asc') {
    return orderBy(field, direction);
  }

  /**
   * Helper method to build limit clause
   *
   * @param count - Number of documents to limit
   * @returns QueryConstraint for limit clause
   */
  protected limitClause(count: number) {
    return limit(count);
  }

  /**
   * Handle errors and convert to AppError format
   *
   * @param error - Error object
   * @returns Formatted AppError
   */
  protected handleError(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        code: 'FIREBASE_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
    };
  }
}
