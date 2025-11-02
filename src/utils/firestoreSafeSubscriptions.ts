import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  Query, 
  CollectionReference, 
  DocumentReference,
  FirestoreError,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Keep track of active subscriptions to prevent duplicates
const activeSubscriptions = new Map<string, (() => void)>();

/**
 * Creates a unique key for a subscription based on the reference
 */
const getSubscriptionKey = (ref: CollectionReference | DocumentReference | Query): string => {
  try {
    // For collections
    if ('path' in ref && typeof ref.path === 'string') {
      if (ref.path.includes('/')) {
        // Likely a document (contains '/')
        return `document:${ref.path}`;
      } else {
        // Likely a collection (no '/' in path)
        return `collection:${ref.path}`;
      }
    }
    // For queries or other references
    return `query:${Date.now()}:${Math.random()}`;
  } catch (e) {
    return `unknown:${Date.now()}:${Math.random()}`;
  }
};

/**
 * Safely subscribes to a Firestore collection
 * Prevents duplicate subscriptions and handles cleanup properly
 */
export const safeSubscribeToCollection = <T extends DocumentData>(
  collectionPath: string,
  onNext: (data: T[]) => void,
  onError?: (error: FirestoreError) => void
): (() => void) => {
  // Create a unique key for this subscription
  const collectionRef = collection(db, collectionPath);
  const subscriptionKey = `collection:${collectionPath}`;
  
  // Check if we already have an active subscription for this path
  if (activeSubscriptions.has(subscriptionKey)) {
    console.warn(`Duplicate subscription attempt for collection: ${collectionPath}`);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  // Create the subscription
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      try {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data()
          } as T & { id: string });
        });
        onNext(data);
      } catch (error) {
        console.error('Error processing collection data:', error);
        if (onError) {
          onError(error as FirestoreError);
        }
      }
    },
    (error) => {
      console.error(`Firestore error for collection ${collectionPath}:`, error);
      if (onError) {
        onError(error);
      }
    }
  );
  
  // Store the unsubscribe function
  activeSubscriptions.set(subscriptionKey, unsubscribe);
  
  // Return a wrapped unsubscribe function that also cleans up our tracking
  return () => {
    unsubscribe();
    activeSubscriptions.delete(subscriptionKey);
  };
};

/**
 * Safely subscribes to a Firestore document
 * Prevents duplicate subscriptions and handles cleanup properly
 */
export const safeSubscribeToDocument = <T extends DocumentData>(
  documentPath: string,
  onNext: (data: T | null) => void,
  onError?: (error: FirestoreError) => void
): (() => void) => {
  // Create a unique key for this subscription
  const subscriptionKey = `document:${documentPath}`;
  
  // Check if we already have an active subscription for this path
  if (activeSubscriptions.has(subscriptionKey)) {
    console.warn(`Duplicate subscription attempt for document: ${documentPath}`);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  // Create the subscription
  const documentRef = doc(db, documentPath);
  const unsubscribe = onSnapshot(
    documentRef,
    (docSnapshot) => {
      try {
        if (docSnapshot.exists()) {
          const data = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as T & { id: string };
          onNext(data);
        } else {
          onNext(null);
        }
      } catch (error) {
        console.error('Error processing document data:', error);
        if (onError) {
          onError(error as FirestoreError);
        }
      }
    },
    (error) => {
      console.error(`Firestore error for document ${documentPath}:`, error);
      if (onError) {
        onError(error);
      }
    }
  );
  
  // Store the unsubscribe function
  activeSubscriptions.set(subscriptionKey, unsubscribe);
  
  // Return a wrapped unsubscribe function that also cleans up our tracking
  return () => {
    unsubscribe();
    activeSubscriptions.delete(subscriptionKey);
  };
};

/**
 * Safely subscribes to a Firestore query
 * Prevents duplicate subscriptions and handles cleanup properly
 */
export const safeSubscribeToQuery = <T extends DocumentData>(
  queryRef: Query,
  onNext: (data: T[]) => void,
  onError?: (error: FirestoreError) => void
): (() => void) => {
  // Create a unique key for this subscription
  const subscriptionKey = `query:${Date.now()}:${Math.random()}`;
  
  // Check if we already have an active subscription for this query
  if (activeSubscriptions.has(subscriptionKey)) {
    console.warn('Duplicate subscription attempt for query');
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  // Create the subscription
  const unsubscribe = onSnapshot(
    queryRef,
    (snapshot) => {
      try {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data()
          } as T & { id: string });
        });
        onNext(data);
      } catch (error) {
        console.error('Error processing query data:', error);
        if (onError) {
          onError(error as FirestoreError);
        }
      }
    },
    (error) => {
      console.error('Firestore error for query:', error);
      if (onError) {
        onError(error);
      }
    }
  );
  
  // Store the unsubscribe function
  activeSubscriptions.set(subscriptionKey, unsubscribe);
  
  // Return a wrapped unsubscribe function that also cleans up our tracking
  return () => {
    unsubscribe();
    activeSubscriptions.delete(subscriptionKey);
  };
};

/**
 * Cleans up all active subscriptions
 * Should be called when the app is shutting down or for testing
 */
export const cleanupAllSubscriptions = () => {
  activeSubscriptions.forEach((unsubscribe, key) => {
    try {
      unsubscribe();
    } catch (error) {
      console.error(`Error unsubscribing from ${key}:`, error);
    }
  });
  activeSubscriptions.clear();
};

export default {
  safeSubscribeToCollection,
  safeSubscribeToDocument,
  safeSubscribeToQuery,
  cleanupAllSubscriptions
};