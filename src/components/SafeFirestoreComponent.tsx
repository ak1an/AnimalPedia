import React, { useEffect, useState, useRef } from "react";
import { 
  collection, 
  onSnapshot, 
  enableIndexedDbPersistence,
  FirestoreError
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

const SafeFirestoreComponent = () => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Reference to the collection
    const colRef = collection(db, "reviews"); // Using reviews collection as an example

    // Subscribe to the collection
    const unsubscribe = onSnapshot(
      colRef,
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
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Отзывы пользователей</h2>
      
      {loading && <p className="text-gray-600">Загрузка данных...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Ошибка: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-gray-600">Нет данных для отображения</p>
          ) : (
            <ul className="space-y-3">
              {data.map((item) => (
                <li 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="font-medium text-gray-800 dark:text-white">
                    {item.username || 'Анонимный пользователь'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    {item.text || 'Нет текста'}
                  </div>
                  {item.rating && (
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700 dark:text-gray-300">
                        {item.rating}/5
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SafeFirestoreComponent;