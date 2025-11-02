import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { 
  safeSubscribeToCollection, 
  safeSubscribeToDocument,
  safeSubscribeToQuery
} from "../utils/firestoreSafeSubscriptions";

// Interface for review data
interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  rating: number;
  likes: number;
  createdAt: any;
}

// Interface for user data
interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  favoriteAnimals: string[];
}

const FirestoreSafeExample: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [specificUser, setSpecificUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    reviews: true,
    users: true,
    specificUser: true
  });
  const [errors, setErrors] = useState<{[key: string]: string | null}>({
    reviews: null,
    users: null,
    specificUser: null
  });

  // Subscribe to reviews collection
  useEffect(() => {
    // Create a query for reviews ordered by creation date
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = safeSubscribeToQuery<Review>(
      reviewsQuery,
      (data) => {
        setReviews(data);
        setLoading(prev => ({ ...prev, reviews: false }));
      },
      (error) => {
        setErrors(prev => ({ ...prev, reviews: error.message }));
        setLoading(prev => ({ ...prev, reviews: false }));
        console.error("Reviews subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to users collection
  useEffect(() => {
    const unsubscribe = safeSubscribeToCollection<User>(
      'users',
      (data) => {
        setUsers(data);
        setLoading(prev => ({ ...prev, users: false }));
      },
      (error) => {
        setErrors(prev => ({ ...prev, users: error.message }));
        setLoading(prev => ({ ...prev, users: false }));
        console.error("Users subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to a specific user document (example with UID 'user123')
  useEffect(() => {
    const unsubscribe = safeSubscribeToDocument<User>(
      'users/user123',
      (data) => {
        setSpecificUser(data);
        setLoading(prev => ({ ...prev, specificUser: false }));
      },
      (error) => {
        setErrors(prev => ({ ...prev, specificUser: error.message }));
        setLoading(prev => ({ ...prev, specificUser: false }));
        console.error("Specific user subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Firestore Safe Subscription Example</h1>
      
      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Reviews</h2>
        
        {loading.reviews && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
          </div>
        )}
        
        {errors.reviews && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading reviews: {errors.reviews}</p>
          </div>
        )}
        
        {!loading.reviews && !errors.reviews && (
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
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${i < (review.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {review.text || 'No review text'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Likes: {review.likes || 0}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {review.createdAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
      
      {/* Users Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Users</h2>
        
        {loading.users && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        )}
        
        {errors.users && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading users: {errors.users}</p>
          </div>
        )}
        
        {!loading.users && !errors.users && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-full">
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
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-xl">U</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {user.name || 'Unnamed User'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.email || 'No email'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        Favorites: {user.favoriteAnimals?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
      
      {/* Specific User Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Specific User</h2>
        
        {loading.specificUser && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading specific user...</p>
          </div>
        )}
        
        {errors.specificUser && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading specific user: {errors.specificUser}</p>
          </div>
        )}
        
        {!loading.specificUser && !errors.specificUser && specificUser && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {specificUser.avatarUrl ? (
                <img 
                  src={specificUser.avatarUrl} 
                  alt={specificUser.name || 'User'} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-2xl">U</span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-xl text-gray-800 dark:text-white">
                  {specificUser.name || 'Unnamed User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {specificUser.email || 'No email'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  UID: {specificUser.uid || 'No UID'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Favorite Animals: {specificUser.favoriteAnimals?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!loading.specificUser && !errors.specificUser && !specificUser && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">User not found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FirestoreSafeExample;