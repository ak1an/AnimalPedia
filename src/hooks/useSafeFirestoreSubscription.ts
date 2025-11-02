import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  FirestoreError,
  Query,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface UseFirestoreSubscriptionOptions {
  collectionName?: string;
  query?: Query;
  documentRef?: DocumentReference;
}

interface UseFirestoreSubscriptionResult<T> {
  data: T[] | T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for safely subscribing to Firestore collections or documents
 * @param options - Configuration options for the subscription
 * @returns Object containing data, loading state, error state, and refetch function
 */
export const useSafeFirestoreSubscription = <T extends DocumentData>(
  options: UseFirestoreSubscriptionOptions
): UseFirestoreSubscriptionResult<T> => {
  const [data, setData] = useState<T[] | T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Refetch function to manually trigger a reload
  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    try {
      let unsubscribe: () => void;

      // Handle document subscription
      if (options.documentRef) {
        unsubscribe = onSnapshot(
          options.documentRef,
          (docSnapshot) => {
            if (!isMountedRef.current) return;
            
            try {
              if (docSnapshot.exists()) {
                const docData = {
                  id: docSnapshot.id,
                  ...docSnapshot.data()
                } as T & { id: string };
                
                if (isMountedRef.current) {
                  setData(docData);
                  setLoading(false);
                }
              } else {
                if (isMountedRef.current) {
                  setData(null);
                  setLoading(false);
                }
              }
            } catch (err) {
              if (isMountedRef.current) {
                setError('Error processing document data');
                setLoading(false);
                console.error('Error processing document data:', err);
              }
            }
          },
          (err: FirestoreError) => {
            if (!isMountedRef.current) return;
            
            if (isMountedRef.current) {
              setError('Firestore document subscription error');
              setLoading(false);
              console.error('Firestore document subscription error:', err);
            }
          }
        );
      } 
      // Handle collection/query subscription
      else {
        const queryRef = options.query || 
          (options.collectionName ? collection(db, options.collectionName) : null);
        
        if (!queryRef) {
          throw new Error('Either collectionName, query, or documentRef must be provided');
        }

        unsubscribe = onSnapshot(
          queryRef,
          (snapshot) => {
            if (!isMountedRef.current) return;
            
            try {
              const items: (T & { id: string })[] = [];
              snapshot.forEach((doc) => {
                items.push({
                  id: doc.id,
                  ...doc.data()
                } as T & { id: string });
              });
              
              if (isMountedRef.current) {
                setData(items);
                setLoading(false);
              }
            } catch (err) {
              if (isMountedRef.current) {
                setError('Error processing collection data');
                setLoading(false);
                console.error('Error processing collection data:', err);
              }
            }
          },
          (err: FirestoreError) => {
            if (!isMountedRef.current) return;
            
            if (isMountedRef.current) {
              setError('Firestore collection subscription error');
              setLoading(false);
              console.error('Firestore collection subscription error:', err);
            }
          }
        );
      }
      
      // Store unsubscribe function for cleanup
      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (isMountedRef.current) {
        setError('Error setting up Firestore subscription');
        setLoading(false);
        console.error('Error setting up Firestore subscription:', err);
      }
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [options.collectionName, options.query, options.documentRef]);

  return { data, loading, error, refetch };
};