import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { RootState } from '../../store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import AnimalCard from '../Categories/AnimalCard';
import mammalsData from '../../data/mammals.json';
import birdsData from '../../data/birds.json';
import reptilesData from '../../data/reptiles.json';
import amphibiansData from '../../data/amphibians.json';
import fishData from '../../data/fish.json';
import insectsData from '../../data/insects.json';
import { safeSubscribeToCollection } from '../../utils/firestoreSafeSubscriptions';

// Define the animal item type
interface AnimalItem {
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
  diet?: string;
  sleep?: string;
  facts?: string[];
}

/**
 * PopularAnimals component for AnimalPedia homepage
 * Displays a grid of popular animals based on likes count
 */
const PopularAnimals: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [user] = useAuthState(auth);
  const reduxUser = useSelector((state: RootState) => state.user);
  const [animals, setAnimals] = useState<AnimalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Combine all animal data
  const allAnimals = [
    ...mammalsData,
    ...birdsData,
    ...reptilesData,
    ...amphibiansData,
    ...fishData,
    ...insectsData
  ];

  // Create a map of all animals for quick lookup
  const animalsMap: Record<string, any> = {};
  allAnimals.forEach((animal: any) => {
    animalsMap[animal.id] = animal;
  });

  // Fetch popular animals from Firestore
  useEffect(() => {
    // Set up real-time listener for users collection using safe subscription
    const unsubscribe = safeSubscribeToCollection(
      'users',
      (usersData) => {
        try {
          console.log('Users snapshot updated, fetching popular animals...');
          
          // Count how many users have liked each animal
          const likeCounts: Record<string, number> = {};
          
          usersData.forEach((userData: any) => {
            const likedAnimals = userData.likedAnimals || [];
            
            likedAnimals.forEach((animalId: string) => {
              // Check if the animal exists in our local animals data
              if (animalsMap[animalId]) {
                if (!likeCounts[animalId]) {
                  likeCounts[animalId] = 0;
                }
                likeCounts[animalId]++;
              }
            });
          });
          
          console.log('Like counts calculated:', likeCounts);
          
          // Convert to array and sort by like count
          const popularAnimals: any[] = [];
          for (const [animalId, likeCount] of Object.entries(likeCounts)) {
            // Only include animals with at least one like
            if (likeCount > 0 && animalsMap[animalId]) {
              popularAnimals.push({
                ...animalsMap[animalId],
                likeCount
              });
            }
          }
          
          // Sort by like count in descending order
          popularAnimals.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          
          console.log('Sorted popular animals:', popularAnimals);
          
          // Get top 5 animals
          const topAnimals = popularAnimals.slice(0, 5);
          
          console.log('Top 5 animals:', topAnimals);
          
          // If user is authenticated, update favorite status based on their favorites
          if (reduxUser.isAuthenticated) {
            const updatedAnimals = topAnimals.map((animal: any) => ({
              ...animal,
              isFavorite: reduxUser.favoriteAnimals.includes(animal.id)
            }));
            setAnimals(updatedAnimals);
          } else {
            // Set default favorite status to false for unauthenticated users
            const updatedAnimals = topAnimals.map((animal: any) => ({
              ...animal,
              isFavorite: false
            }));
            setAnimals(updatedAnimals);
          }
        } catch (error) {
          console.error('Error fetching popular animals:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        // Error handler for the subscription
        console.error('Firestore subscription error:', error);
        setLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [reduxUser]);

  if (loading) {
    return (
      <section className={`py-8 sm:py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Популярные животные</h2>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item} 
                className="nature-card animate-pulse rounded-xl"
              >
                <div className={`h-32 sm:h-40 w-full rounded-t-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="p-3 sm:p-4">
                  <div className={`h-4 sm:h-5 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-3 rounded w-full mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="flex justify-between items-center">
                    <div className={`h-5 sm:h-6 w-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-6 sm:h-8 w-20 sm:w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no animals have likes, show a message
  if (animals.length === 0) {
    return (
      <section className={`py-8 sm:py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Популярные животные</h2>
          </div>
          
          <div className={`text-center py-8 sm:py-12 nature-card rounded-2xl transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg sm:text-xl transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Пока нет популярных животных 😿 Станьте первым, кто поставит лайк!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 sm:py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-green-50'}`}>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>
            Популярные животные
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} isPopular={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAnimals;