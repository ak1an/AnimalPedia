import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  query, 
  orderBy, 
  where
} from 'firebase/firestore';
import { 
  safeSubscribeToCollection, 
  safeSubscribeToDocument,
  safeSubscribeToQuery
} from '../utils/firestoreSafeSubscriptions';
import { db } from '../firebase/config';

// Define types for our data
interface Animal {
  id: string;
  name: string;
  category: string;
  habitat: string;
  photo: string;
  short: string;
  details: string;
  isFavorite: boolean;
  redBook?: boolean;
  likeCount?: number;
}

interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  favoriteAnimals: string[];
}

// Safe Firestore subscription hook
const useFirestoreSubscription = <T,>(
  subscribeFn: () => (() => void),
  deps: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when dependencies change
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Create new subscription using the provided function
      const unsubscribe = subscribeFn();
      
      // Return cleanup function
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to subscribe to data');
      setLoading(false);
    }
  }, deps);

  return { data, loading, error, setData, setError };
};

// Example component using safe Firestore subscriptions
const FirestoreSafeSubscriptionExample: React.FC = () => {
  // Subscribe to animals collection
  const {
    data: animals,
    loading: animalsLoading,
    error: animalsError
  } = useFirestoreSubscription<Animal[]>(
    () => {
      return safeSubscribeToCollection<Animal>(
        'animals',
        (data) => {
          console.log('Animals updated:', data);
          // Sort animals by name
          const sortedAnimals = [...data].sort((a, b) => a.name.localeCompare(b.name));
          // @ts-ignore - setData is available in the hook
          animals?.setData?.(sortedAnimals);
        },
        (error) => {
          console.error('Animals subscription error:', error);
          // @ts-ignore - setError is available in the hook
          animals?.setError?.(error.message);
        }
      );
    },
    [] // No dependencies, so this only runs once
  );

  // Subscribe to a specific user document
  const [userId, setUserId] = useState<string>('user123');
  const {
    data: userData,
    loading: userLoading,
    error: userError
  } = useFirestoreSubscription<User>(
    () => {
      return safeSubscribeToDocument<User>(
        `users/${userId}`,
        (data) => {
          console.log('User updated:', data);
          // @ts-ignore - setData is available in the hook
          userData?.setData?.(data);
        },
        (error) => {
          console.error('User subscription error:', error);
          // @ts-ignore - setError is available in the hook
          userData?.setError?.(error.message);
        }
      );
    },
    [userId] // Re-subscribe when userId changes
  );

  // Subscribe to favorite animals for a user
  const {
    data: favoriteAnimals,
    loading: favoritesLoading,
    error: favoritesError
  } = useFirestoreSubscription<Animal[]>(
    () => {
      if (!userId) {
        return () => {}; // No-op if no userId
      }

      // Create a query for favorite animals
      const favoritesQuery = query(
        collection(db, 'animals'),
        where('likedBy', 'array-contains', userId)
      );
      
      return safeSubscribeToQuery<Animal>(
        favoritesQuery,
        (data) => {
          console.log('Favorites updated:', data);
          // @ts-ignore - setData is available in the hook
          favoriteAnimals?.setData?.(data);
        },
        (error) => {
          console.error('Favorites subscription error:', error);
          // @ts-ignore - setError is available in the hook
          favoriteAnimals?.setError?.(error.message);
        }
      );
    },
    [userId] // Re-subscribe when userId changes
  );

  // Handle user ID change
  const handleUserIdChange = (newUserId: string) => {
    setUserId(newUserId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Safe Firestore Subscription Example</h1>
      
      {/* User ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          User ID:
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => handleUserIdChange(e.target.value)}
          className="border rounded px-3 py-2 w-64"
          placeholder="Enter user ID"
        />
      </div>

      {/* Animals Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Animals</h2>
        {animalsLoading && <p>Loading animals...</p>}
        {animalsError && <p className="text-red-500">Error: {animalsError}</p>}
        {animals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {animals.map((animal) => (
              <div key={animal.id} className="border rounded p-4">
                <h3 className="font-bold">{animal.name}</h3>
                <p>Category: {animal.category}</p>
                <p>Habitat: {animal.habitat}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Data</h2>
        {userLoading && <p>Loading user...</p>}
        {userError && <p className="text-red-500">Error: {userError}</p>}
        {userData && (
          <div className="border rounded p-4">
            <h3 className="font-bold">{userData.name}</h3>
            <p>Email: {userData.email}</p>
            <p>UID: {userData.uid}</p>
          </div>
        )}
      </div>

      {/* Favorites Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Favorite Animals</h2>
        {favoritesLoading && <p>Loading favorites...</p>}
        {favoritesError && <p className="text-red-500">Error: {favoritesError}</p>}
        {favoriteAnimals && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteAnimals.length > 0 ? (
              favoriteAnimals.map((animal) => (
                <div key={animal.id} className="border rounded p-4">
                  <h3 className="font-bold">{animal.name}</h3>
                  <p>Category: {animal.category}</p>
                </div>
              ))
            ) : (
              <p>No favorite animals found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirestoreSafeSubscriptionExample;