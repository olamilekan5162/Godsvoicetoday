import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { startOfDay, endOfDay } from "date-fns";

const DEVOTIONS_COLLECTION = "devotions";

/**
 * Custom hook for managing devotions from Firestore
 * Provides CRUD operations and real-time listeners
 */
export const useDevotions = () => {
  /**
   * Get today's devotion
   * @returns {Promise<Object|null>} Today's devotion or null
   */
  const getTodaysDevotional = async () => {
    try {
      const today = new Date();
      const startOfToday = Timestamp.fromDate(startOfDay(today));
      const endOfToday = Timestamp.fromDate(endOfDay(today));

      const q = query(
        collection(db, DEVOTIONS_COLLECTION),
        where("publishDate", ">=", startOfToday),
        where("publishDate", "<=", endOfToday),
        where("isPublished", "==", true),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const devotionDoc = snapshot.docs[0];
        return { id: devotionDoc.id, ...devotionDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching today's devotion:", error);
      throw error;
    }
  };

  /**
   * Get devotion by specific date
   * @param {Date} date - Target date
   * @returns {Promise<Object|null>} Devotion for the date or null
   */
  const getDevotionByDate = async (date) => {
    try {
      const startOfTargetDay = Timestamp.fromDate(startOfDay(date));
      const endOfTargetDay = Timestamp.fromDate(endOfDay(date));

      const q = query(
        collection(db, DEVOTIONS_COLLECTION),
        where("publishDate", ">=", startOfTargetDay),
        where("publishDate", "<=", endOfTargetDay),
        where("isPublished", "==", true),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const devotionDoc = snapshot.docs[0];
        return { id: devotionDoc.id, ...devotionDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching devotion by date:", error);
      throw error;
    }
  };

  /**
   * Get devotion by ID
   * @param {string} id - Devotion document ID
   * @returns {Promise<Object|null>} Devotion data or null
   */
  const getDevotionById = async (id) => {
    try {
      const devotionDoc = await getDoc(doc(db, DEVOTIONS_COLLECTION, id));
      if (devotionDoc.exists()) {
        return { id: devotionDoc.id, ...devotionDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching devotion by ID:", error);
      throw error;
    }
  };

  /**
   * Get published devotions with pagination
   * @param {number} limitCount - Number of devotions to fetch
   * @returns {Promise<Array>} Array of devotions
   */
  const getPublishedDevotions = async (limitCount = 12) => {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, DEVOTIONS_COLLECTION),
        where("isPublished", "==", true),
        where("publishDate", "<=", now),
        orderBy("publishDate", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching published devotions:", error);
      throw error;
    }
  };

  /**
   * Get all devotions (admin only) with real-time updates
   * @param {Function} callback - Callback function to receive devotions
   * @returns {Function} Unsubscribe function
   */
  const subscribeToAllDevotions = (callback) => {
    const q = query(
      collection(db, DEVOTIONS_COLLECTION),
      orderBy("publishDate", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const devotions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(devotions);
      },
      (error) => {
        console.error("Error in devotions subscription:", error);
      }
    );
  };

  /**
   * Create a new devotion
   * @param {Object} devotionData - Devotion data
   * @returns {Promise<string>} New devotion ID
   */
  const createDevotion = async (devotionData) => {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, DEVOTIONS_COLLECTION), {
        ...devotionData,
        publishDate: Timestamp.fromDate(devotionData.publishDate),
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating devotion:", error);
      throw error;
    }
  };

  /**
   * Update an existing devotion
   * @param {string} id - Devotion ID
   * @param {Object} devotionData - Updated devotion data
   * @returns {Promise<void>}
   */
  const updateDevotion = async (id, devotionData) => {
    try {
      const devotionRef = doc(db, DEVOTIONS_COLLECTION, id);
      await updateDoc(devotionRef, {
        ...devotionData,
        publishDate:
          devotionData.publishDate instanceof Date
            ? Timestamp.fromDate(devotionData.publishDate)
            : devotionData.publishDate,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating devotion:", error);
      throw error;
    }
  };

  /**
   * Delete a devotion
   * @param {string} id - Devotion ID
   * @returns {Promise<void>}
   */
  const deleteDevotion = async (id) => {
    try {
      await deleteDoc(doc(db, DEVOTIONS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting devotion:", error);
      throw error;
    }
  };

  /**
   * Toggle publish status of a devotion
   * @param {string} id - Devotion ID
   * @param {boolean} isPublished - New publish status
   * @returns {Promise<void>}
   */
  const togglePublishStatus = async (id, isPublished) => {
    try {
      const devotionRef = doc(db, DEVOTIONS_COLLECTION, id);
      await updateDoc(devotionRef, {
        isPublished,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error toggling publish status:", error);
      throw error;
    }
  };

  return {
    getTodaysDevotional,
    getDevotionByDate,
    getDevotionById,
    getPublishedDevotions,
    subscribeToAllDevotions,
    createDevotion,
    updateDevotion,
    deleteDevotion,
    togglePublishStatus,
  };
};

export default useDevotions;
