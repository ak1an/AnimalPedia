import React, { useState, useEffect, useRef } from "react";
import { 
  collection, 
  onSnapshot, 
  FirestoreError,
  DocumentData
} from "firebase/firestore";
import { db } from "../firebase/config";

// Interface for Firestore items
interface FirestoreItem {
  id: string;
  [key: string]: any;
}

// Hook for safe Firestore subscriptions that prevents duplicate subscriptions
const useSafeFirestoreSubscription = <T extends DocumentData,>(
  collectionPath: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    try {
      // Create collection reference
      const collectionRef = collection(db, collectionPath);
      
      // Create the subscription
      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          // Check if component is still mounted before updating state
          if (!isMountedRef.current) return;
          
          try {
            const items: T[] = [];
            snapshot.forEach((doc) => {
              items.push({
                id: doc.id,
                ...doc.data()
              } as T & { id: string });
            });
            
            // Only update state if component is still mounted
            if (isMountedRef.current) {
              setData(items);
              setLoading(false);
            }
          } catch (err) {
            if (isMountedRef.current) {
              setError("Error processing Firestore data");
              setLoading(false);
              console.error("Error processing Firestore data:", err);
            }
          }
        },
        (err: FirestoreError) => {
          // Check if component is still mounted before updating state
          if (!isMountedRef.current) return;
          
          if (isMountedRef.current) {
            setError(`Firestore subscription error: ${err.message}`);
            setLoading(false);
            console.error(`Firestore error for collection ${collectionPath}:`, err);
          }
        }
      );
      
      // Store the unsubscribe function
      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (isMountedRef.current) {
        setError("Error setting up Firestore subscription");
        setLoading(false);
        console.error("Error setting up Firestore subscription:", err);
      }
    }

    // Cleanup function - unsubscribe and mark as unmounted
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [collectionPath]);

  return { data, loading, error };
};

// Simple component demonstrating safe Firestore subscriptions
const SafeFirestoreDemo: React.FC = () => {
  // Subscribe to reviews collection
  const { 
    data: reviews, 
    loading: reviewsLoading, 
    error: reviewsError 
  } = useSafeFirestoreSubscription<any>('reviews');

  // Subscribe to users collection
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError 
  } = useSafeFirestoreSubscription<any>('users');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Safe Firestore Demo</h1>
      
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

export default SafeFirestoreDemo;