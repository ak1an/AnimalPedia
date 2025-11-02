import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, FirestoreError } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Hook for safely subscribing to a Firestore document
 * Prevents duplicate subscriptions and handles cleanup properly
 * 
 * @param documentPath - The path to the Firestore document (e.g., "users/user123")
 * @returns An object containing the data, loading state, and error state
 */
export const useFirestoreDocument = <T extends { id: string }>(
  documentPath: string
) => {
  const [data, setData] = useState<T | null>(null);
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
      // Create document reference
      const docRef = doc(db, documentPath);
      
      // Create the subscription
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          // Check if component is still mounted before updating state
          if (!isMountedRef.current) return;
          
          try {
            if (docSnapshot.exists()) {
              const docData = {
                id: docSnapshot.id,
                ...docSnapshot.data()
              } as T;
              
              // Only update state if component is still mounted
              if (isMountedRef.current) {
                setData(docData);
                setLoading(false);
              }
            } else {
              // Document doesn't exist
              if (isMountedRef.current) {
                setData(null);
                setLoading(false);
              }
            }
          } catch (err) {
            if (isMountedRef.current) {
              setError("Error processing Firestore document data");
              setLoading(false);
              console.error("Error processing Firestore document data:", err);
            }
          }
        },
        (err: FirestoreError) => {
          // Check if component is still mounted before updating state
          if (!isMountedRef.current) return;
          
          if (isMountedRef.current) {
            setError(`Firestore document subscription error: ${err.message}`);
            setLoading(false);
            console.error(`Firestore error for document ${documentPath}:`, err);
          }
        }
      );
      
      // Store the unsubscribe function
      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (isMountedRef.current) {
        setError("Error setting up Firestore document subscription");
        setLoading(false);
        console.error("Error setting up Firestore document subscription:", err);
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
  }, [documentPath]);

  return { data, loading, error };
};