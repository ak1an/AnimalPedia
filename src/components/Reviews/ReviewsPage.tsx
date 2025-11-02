import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { safeSubscribeToCollection, safeSubscribeToQuery } from '../../utils/firestoreSafeSubscriptions';

interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  rating: number;
  likes: number;
  createdAt: any; // Firestore timestamp
}

// Function to add a review to Firestore
export async function addReview(username: string, text: string, rating: number) {
  try {
    // Validate fields
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }
    
    if (!text || text.trim() === '') {
      throw new Error('Review text is required');
    }
    
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    // Get current user info for userId and avatarUrl
    const currentUser = auth.currentUser;
    let userId = '';
    let avatarUrl = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
    
    if (currentUser) {
      userId = currentUser.uid;
      // Try to get avatar from user's profile
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          avatarUrl = userData.avatarUrl || avatarUrl;
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    }
    
    // Add review to Firestore
    const docRef = await addDoc(collection(db, 'reviews'), {
      userId,
      username: username.trim(),
      avatarUrl,
      text: text.trim(),
      rating: Number(rating),
      createdAt: serverTimestamp()
    });
    
    console.log('Review added with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error adding review: ', error);
    return { success: false, error: error.message };
  }
}

// Function to like a review
export async function likeReview(reviewId: string) {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Update the review document by incrementing the likes count
    await updateDoc(doc(db, 'reviews', reviewId), {
      likes: increment(1)
    });
    
    console.log('Review liked successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error liking review: ', error);
    return { success: false, error: error.message };
  }
}

const ReviewsPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  // Fetch reviews in real-time
  useEffect(() => {
    // Create a query for reviews ordered by creation date
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    
    // Subscribe to the reviews collection using safe subscription
    const unsubscribe = safeSubscribeToQuery(
      reviewsQuery,
      async (reviewsData: any[]) => {
        // For each review, try to fetch the user's avatar from their profile
        const reviewsWithAvatars = reviewsData.map(async (review) => {
          if (review.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', review.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                  ...review,
                  avatarUrl: userData.avatarUrl || review.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }
          return {
            ...review,
            avatarUrl: review.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
          };
        });
        
        Promise.all(reviewsWithAvatars).then((updatedReviews) => {
          setReviews(updatedReviews);
          setLoading(false);
        });
      },
      (error) => {
        // Error handler for the subscription
        console.error('Firestore subscription error:', error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Function to handle liking a review
  const handleLikeReview = async (reviewId: string) => {
    if (!user) {
      setError('Войдите в аккаунт, чтобы поставить лайк');
      return;
    }
    
    // Check if user has already liked this review in this session
    if (likedReviews.has(reviewId)) {
      alert("Вы уже ставили лайк этому отзыву");
      return;
    }
    
    try {
      const result = await likeReview(reviewId);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Update the liked reviews set
      setLikedReviews(prev => new Set(prev).add(reviewId));
      
      // Update the reviews state to immediately reflect the like count change
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, likes: (review.likes || 0) + 1 } 
            : review
        )
      );
    } catch (err: any) {
      console.error('Error liking review:', err);
      setError('Не удалось поставить лайк. Попробуйте ещё раз.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Войдите в аккаунт, чтобы оставить отзыв');
      return;
    }
    
    if (rating === 0) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }
    
    if (!reviewText.trim()) {
      setError('Введите текст отзыва');
      return;
    }
    
    if (reviewText.length > 500) {
      setError('Отзыв не должен превышать 500 символов');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const result = await addReview(
        user.displayName || user.email || 'Аноним',
        reviewText,
        rating
      );
      
      if (result.success) {
        setReviewText('');
        setRating(0);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error('Error adding review:', err);
      setError('Не удалось отправить отзыв. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      // Format as dd.mm.yyyy
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (e) {
      return '';
    }
  };

  // Render star rating
  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
              star <= (interactive ? (hoverRating || rating) : rating)
                ? 'text-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            } text-xl focus:outline-none`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            disabled={!interactive}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Отзывы пользователей</h1>
      
      {/* Review Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {user ? 'Оставить отзыв' : 'Войдите, чтобы оставить отзыв'}
        </h2>
        
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Ваша оценка</label>
              <div className="mb-4">
                {renderStars(rating, true)}
              </div>
            </div>
            
            <div className="mb-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Ваш отзыв..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={4}
                maxLength={500}
                disabled={submitting}
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                {reviewText.length}/500
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 dark:text-red-400 mb-4">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              {submitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-start">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Чтобы оставить отзыв, пожалуйста, войдите в свой аккаунт.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Войти
            </button>
          </div>
        )}
      </div>
      
      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Все отзывы</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Пока нет отзывов. Будьте первым, кто оставит отзыв!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md flex items-start gap-3 transition-all duration-300 hover:shadow-lg"
              >
                <img 
                  src={review.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} 
                  alt={`${review.username}'s avatar`} 
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white">{review.username}</h4>
                    <div className="flex ml-auto">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-2">
                    {review.text}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      disabled={!user || likedReviews.has(review.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-sm transition-colors duration-200 ${
                        user && !likedReviews.has(review.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      }`}
                      title={
                        !user 
                          ? "Войдите, чтобы поставить лайк" 
                          : likedReviews.has(review.id)
                          ? "Вы уже поставили лайк"
                          : "Поставить лайк"
                      }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{review.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;