import React from "react";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { useFirestoreDocument } from "../hooks/useFirestoreDocument";

// Define interfaces for our data
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

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  favoriteAnimals: string[];
}

const FirestoreSafeSubscriptionExample: React.FC = () => {
  // Subscribe to reviews collection
  const { 
    data: reviews, 
    loading: reviewsLoading, 
    error: reviewsError 
  } = useFirestoreCollection<Review>('reviews');

  // Subscribe to users collection
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError 
  } = useFirestoreCollection<User>('users');

  // Subscribe to a specific user document (example)
  const { 
    data: specificUser, 
    loading: userLoading, 
    error: userError 
  } = useFirestoreDocument<User>('users/someUserId');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Firestore Safe Subscription Example</h1>
      
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
        
        {userLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">Loading specific user...</p>
          </div>
        )}
        
        {userError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading specific user: {userError}</p>
          </div>
        )}
        
        {!userLoading && !userError && specificUser && (
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
        
        {!userLoading && !userError && !specificUser && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-600 dark:text-gray-400">User not found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FirestoreSafeSubscriptionExample;