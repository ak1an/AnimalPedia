import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  initializeApp, 
  FirebaseApp,
  FirebaseOptions 
} from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  enableIndexedDbPersistence,
  Firestore,
  FirestoreError,
  Query,
  CollectionReference,
  DocumentReference,
  DocumentData
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBcFCpB09KcJsUfC54jZj83oDjrnbRjyQ8",
  authDomain: "animallpedia.firebaseapp.com",
  projectId: "animallpedia",
  storageBucket: "animallpedia.firebasestorage.app",
  messagingSenderId: "911946213967",
  appId: "1:911946213967:web:9d7afe560956096117983a",
  measurementId: "G-DWFRPC0H6E",
  databaseURL: "https://animallpedia-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn("Firebase app already initialized");
  app = initializeApp(firebaseConfig, "animalpedia-instance");
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Safely enable IndexedDB persistence with proper error handling
const initializePersistence = () => {
  // Only initialize in browser environment
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    // Use a flag to ensure persistence is only initialized once
    const persistenceInitialized = (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__;
    
    if (!persistenceInitialized) {
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log('Firestore persistence enabled');
          (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__ = true;
        })
        .catch((err: FirestoreError) => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Firestore persistence failed: Multiple tabs open');
          } else if (err.code === 'unimplemented') {
            // The current browser doesn't support persistence
            console.warn('Firestore persistence not supported in this browser');
          } else {
            console.error('Unexpected error enabling Firestore persistence:', err);
          }
          // Mark as initialized even if it failed to prevent retries
          (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__ = true;
        });
    }
  }
};

// Initialize persistence when the module loads
initializePersistence();

// Interface for Firestore items
interface FirestoreItem {
  id: string;
  [key: string]: any;
}

// Safe subscription manager to prevent duplicate subscriptions
class SafeSubscriptionManager {
  private static instance: SafeSubscriptionManager;
  private subscriptions: Map<string, (() => void)> = new Map();
  private componentRefs: Map<string, Set<string>> = new Map();

  private constructor() {}

  static getInstance(): SafeSubscriptionManager {
    if (!SafeSubscriptionManager.instance) {
      SafeSubscriptionManager.instance = new SafeSubscriptionManager();
    }
    return SafeSubscriptionManager.instance;
  }

  // Generate a unique key for a subscription
  private generateKey(ref: CollectionReference | DocumentReference | Query, componentId: string): string {
    try {
      // For collections
      if ('path' in ref && typeof ref.path === 'string') {
        if (ref.path.includes('/')) {
          // Likely a document (contains '/')
          return `document:${ref.path}:${componentId}`;
        } else {
          // Likely a collection (no '/' in path)
          return `collection:${ref.path}:${componentId}`;
        }
      }
      // For queries or other references
      return `query:${Date.now()}:${Math.random()}:${componentId}`;
    } catch (e) {
      return `unknown:${Date.now()}:${Math.random()}:${componentId}`;
    }
  }

  // Subscribe to a collection
  subscribeToCollection<T extends DocumentData>(
    collectionPath: string,
    componentId: string,
    onNext: (data: T[]) => void,
    onError?: (error: FirestoreError) => void
  ): (() => void) {
    const collectionRef = collection(db, collectionPath);
    const key = this.generateKey(collectionRef, componentId);

    // Check if we already have an active subscription for this key
    if (this.subscriptions.has(key)) {
      console.warn(`Duplicate subscription attempt for collection: ${collectionPath} in component: ${componentId}`);
      return () => {}; // Return no-op unsubscribe
    }

    // Track component reference
    if (!this.componentRefs.has(componentId)) {
      this.componentRefs.set(componentId, new Set());
    }
    this.componentRefs.get(componentId)?.add(key);

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
    this.subscriptions.set(key, unsubscribe);

    // Return wrapped unsubscribe function
    return () => {
      unsubscribe();
      this.subscriptions.delete(key);
      this.componentRefs.get(componentId)?.delete(key);
      if (this.componentRefs.get(componentId)?.size === 0) {
        this.componentRefs.delete(componentId);
      }
    };
  }

  // Subscribe to a document
  subscribeToDocument<T extends DocumentData>(
    documentPath: string,
    componentId: string,
    onNext: (data: T | null) => void,
    onError?: (error: FirestoreError) => void
  ): (() => void) {
    const documentRef = doc(db, documentPath);
    const key = `document:${documentPath}:${componentId}`;

    // Check if we already have an active subscription for this key
    if (this.subscriptions.has(key)) {
      console.warn(`Duplicate subscription attempt for document: ${documentPath} in component: ${componentId}`);
      return () => {}; // Return no-op unsubscribe
    }

    // Track component reference
    if (!this.componentRefs.has(componentId)) {
      this.componentRefs.set(componentId, new Set());
    }
    this.componentRefs.get(componentId)?.add(key);

    // Create the subscription
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
    this.subscriptions.set(key, unsubscribe);

    // Return wrapped unsubscribe function
    return () => {
      unsubscribe();
      this.subscriptions.delete(key);
      this.componentRefs.get(componentId)?.delete(key);
      if (this.componentRefs.get(componentId)?.size === 0) {
        this.componentRefs.delete(componentId);
      }
    };
  }

  // Cleanup all subscriptions for a component
  cleanupComponent(componentId: string) {
    const keys = this.componentRefs.get(componentId);
    if (keys) {
      keys.forEach(key => {
        const unsubscribe = this.subscriptions.get(key);
        if (unsubscribe) {
          try {
            unsubscribe();
          } catch (error) {
            console.error(`Error unsubscribing from ${key}:`, error);
          }
          this.subscriptions.delete(key);
        }
      });
      this.componentRefs.delete(componentId);
    }
  }

  // Cleanup all subscriptions
  cleanupAll() {
    this.subscriptions.forEach((unsubscribe, key) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error);
      }
    });
    this.subscriptions.clear();
    this.componentRefs.clear();
  }
}

// Get the subscription manager instance
const subscriptionManager = SafeSubscriptionManager.getInstance();

// Hook for safe Firestore subscriptions
const useSafeFirestoreSubscription = <T extends DocumentData,>(
  collectionPath: string,
  componentId: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;

    // Subscribe to the collection
    const unsubscribe = subscriptionManager.subscribeToCollection<T>(
      collectionPath,
      componentId,
      (items) => {
        if (isMountedRef.current) {
          setData(items);
          setLoading(false);
        }
      },
      (err) => {
        if (isMountedRef.current) {
          setError(err.message);
          setLoading(false);
          console.error(`Firestore subscription error for ${collectionPath}:`, err);
        }
      }
    );

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [collectionPath, componentId]);

  return { data, loading, error };
};

// Example component demonstrating safe Firestore subscriptions
const ComprehensiveSafeFirestoreExample: React.FC = () => {
  // Generate a unique component ID
  const componentId = useCallback(() => {
    return `component_${Math.random().toString(36).substr(2, 9)}`;
  }, [])();

  // Use the safe subscription hook for reviews
  const { 
    data: reviews, 
    loading: reviewsLoading, 
    error: reviewsError 
  } = useSafeFirestoreSubscription<any>('reviews', `${componentId}_reviews`);

  // Use the safe subscription hook for users
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError 
  } = useSafeFirestoreSubscription<any>('users', `${componentId}_users`);

  // Handle component unmount
  useEffect(() => {
    return () => {
      subscriptionManager.cleanupComponent(componentId);
    };
  }, [componentId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Safe Firestore Example</h1>
      
      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Reviews</h2>
        
        {reviewsLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
          </div>
        )}
        
        {reviewsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading reviews: {reviewsError}</p>
          </div>
        )}
        
        {!reviewsLoading && !reviewsError && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <p className="text-gray-600 dark:text-gray-400">No reviews found</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {review.username || 'Anonymous'}
                    </h3>
                    {review.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {review.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {review.text || 'No review text'}
                  </p>
                  {review.likes > 0 && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Likes: {review.likes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>
      
      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Users</h2>
        
        {usersLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        )}
        
        {usersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading users: {usersError}</p>
          </div>
        )}
        
        {!usersLoading && !usersError && (
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <p className="text-gray-600 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div 
                  key={user.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name || 'User'} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">U</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {user.name || 'Unnamed User'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ComprehensiveSafeFirestoreExample;