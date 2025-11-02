import React, { useEffect, useState, useRef } from "react";
import { 
  collection, 
  onSnapshot, 
  enableIndexedDbPersistence,
  FirestoreError,
  Query
} from "firebase/firestore";
import { db } from "../firebase/config";

// Safely enable IndexedDB persistence with proper error handling
const initializePersistence = () => {
  try {
    // Only initialize persistence in browser environment
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      enableIndexedDbPersistence(db).catch((err: FirestoreError) => {
        if (err.code === "failed-precondition") {
          console.warn("Persistence failed: multiple tabs open");
        } else if (err.code === "unimplemented") {
          console.warn("Persistence not available in this browser");
        } else {
          console.error("Unexpected persistence error:", err);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing persistence:", error);
  }
};

// Initialize persistence when the module loads
initializePersistence();

interface FirestoreItem {
  id: string;
  [key: string]: any;
}

interface GenericSafeFirestoreComponentProps {
  collectionName: string;
  query?: Query;
  renderItem?: (item: FirestoreItem) => React.ReactNode;
  loadingMessage?: string;
  emptyMessage?: string;
}

const GenericSafeFirestoreComponent: React.FC<GenericSafeFirestoreComponentProps> = ({
  collectionName,
  query,
  renderItem,
  loadingMessage = "Загрузка данных...",
  emptyMessage = "Нет данных для отображения"
}) => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Determine the query to use
    const unsubscribeQuery = query || collection(db, collectionName);

    // Subscribe to the collection or query
    const unsubscribe = onSnapshot(
      unsubscribeQuery,
      (snapshot) => {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;
        
        try {
          const items: FirestoreItem[] = [];
          snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
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
        
        setError("Firestore subscription error");
        setLoading(false);
        console.error("Firestore onSnapshot error:", err);
      }
    );

    // Cleanup function - unsubscribe and mark as unmounted
    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [collectionName, query]); // Re-run if collectionName or query changes

  // Default render function for items
  const defaultRenderItem = (item: FirestoreItem) => (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
        {JSON.stringify(item, null, 2)}
      </pre>
    </div>
  );

  const itemRenderer = renderItem || defaultRenderItem;

  return (
    <div className="w-full">
      {loading && (
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">{loadingMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Ошибка: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div>
          {data.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {data.map((item) => (
                <div key={item.id}>
                  {itemRenderer(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenericSafeFirestoreComponent;