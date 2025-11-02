import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, FirestoreError } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Hook for safely subscribing to a Firestore collection
 * Prevents duplicate subscriptions and handles cleanup properly
 * 
 * @param collectionName - The name of the Firestore collection to subscribe to
 * @returns An object containing the data, loading state, and error state
 */
export const useFirestoreCollection = <T extends { id: string }>(
  collectionName: string
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
      const colRef = collection(db, collectionName);
      
      // Create the subscription
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          // Check if component is still mounted before updating state
          if (!isMountedRef.current) return;
          
          try {
            const items: T[] = [];
            snapshot.forEach((doc) => {
              items.push({
                id: doc.id,
                ...doc.data()
              } as T);
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
            console.error(`Firestore error for collection ${collectionName}:`, err);
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
  }, [collectionName]);

  return { data, loading, error };
};