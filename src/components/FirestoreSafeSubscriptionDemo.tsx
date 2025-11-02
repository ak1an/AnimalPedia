import React from "react";
import { collection, query, orderBy, getFirestore } from "firebase/firestore";
import { useSafeCollection } from "../hooks/useSafeFirestoreCollection";
import { useSafeDocument } from "../hooks/useSafeFirestoreDocument";
import { useSafeQuery } from "../hooks/useSafeFirestoreQuery";

const FirestoreSafeSubscriptionDemo: React.FC = () => {
  // Get Firestore instance
  const db = getFirestore();
  
  // Subscribe to reviews collection using the safe hook
  const reviews = useSafeCollection(db, "reviews");
  
  // Subscribe to a specific user document
  const user = useSafeDocument(db, "users/someUserId");
  
  // Subscribe to users ordered by name
  const usersQuery = query(collection(db, "users"), orderBy("name"));
  const users = useSafeQuery(db, usersQuery);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Firestore Safe Subscription Demo</h1>
      
      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No reviews found</p>
          ) : (
            reviews.map((review: any) => (
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
              </div>
            ))
          )}
        </div>
      </section>
      
      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Users</h2>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          ) : (
            users.map((user: any) => (
              <div 
                key={user.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {user.name || 'Unnamed User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email || 'No email'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default FirestoreSafeSubscriptionDemo;