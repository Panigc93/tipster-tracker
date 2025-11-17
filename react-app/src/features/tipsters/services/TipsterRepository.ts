import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import type { Tipster, CreateTipsterDto, UpdateTipsterDto } from '../types';

/**
 * Repository for Tipster CRUD operations
 * Implements Single Responsibility Principle - only handles data access
 */
export class TipsterRepository {
  private readonly collectionName = 'tipsters';
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Get all tipsters for a specific user
   */
  async getAll(uid: string): Promise<Tipster[]> {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where('uid', '==', uid),
        orderBy('createdDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const tipsters: Tipster[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        tipsters.push({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as Tipster);
      }

      return tipsters;
    } catch (error) {
      console.error('Error fetching tipsters:', error);
      throw new Error('Failed to fetch tipsters');
    }
  }

  /**
   * Get a single tipster by ID
   */
  async getById(id: string, uid: string): Promise<Tipster | null> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      // Security check: ensure tipster belongs to user
      if (data.uid !== uid) {
        throw new Error('Unauthorized access to tipster');
      }

      return {
        ...data,
        id: docSnap.id,
      } as Tipster;
    } catch (error) {
      console.error('Error fetching tipster:', error);
      throw new Error('Failed to fetch tipster');
    }
  }

  /**
   * Create a new tipster
   */
  async create(data: CreateTipsterDto): Promise<Tipster> {
    try {
      const tipsterData = {
        ...data,
        lastPickDate: null,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(this.db, this.collectionName),
        tipsterData
      );

      return {
        id: docRef.id,
        ...data,
        lastPickDate: null,
      };
    } catch (error) {
      console.error('Error creating tipster:', error);
      throw new Error('Failed to create tipster');
    }
  }

  /**
   * Update an existing tipster
   */
  async update(
    id: string,
    uid: string,
    data: UpdateTipsterDto
  ): Promise<void> {
    try {
      // First verify ownership
      const existing = await this.getById(id, uid);
      if (!existing) {
        throw new Error('Tipster not found or unauthorized');
      }

      const docRef = doc(this.db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating tipster:', error);
      throw new Error('Failed to update tipster');
    }
  }

  /**
   * Delete a tipster
   * Note: In production, you might want to cascade delete related picks
   */
  async delete(id: string, uid: string): Promise<void> {
    try {
      // First verify ownership
      const existing = await this.getById(id, uid);
      if (!existing) {
        throw new Error('Tipster not found or unauthorized');
      }

      const docRef = doc(this.db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting tipster:', error);
      throw new Error('Failed to delete tipster');
    }
  }

  /**
   * Update lastPickDate for a tipster
   * Called when a new pick is added
   */
  async updateLastPickDate(id: string, date: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await updateDoc(docRef, {
        lastPickDate: date,
      });
    } catch (error) {
      console.error('Error updating lastPickDate:', error);
      throw new Error('Failed to update lastPickDate');
    }
  }
}
