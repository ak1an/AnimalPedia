import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { getRecentlyViewedAnimals } from '../../firebase/userOperations';
import AnimalCard from '../Categories/AnimalCard';

// Define the Animal interface
interface Animal {
  id: string;
  name: string;
  category: string;
  habitat: string;
  photo: string;
  short: string;
  details: string;
  redBook?: boolean;
}

const RecentlyViewedBlock: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recent animals from Firestore when user is authenticated
  useEffect(() => {
    const loadRecentAnimals = async () => {
      if (user) {
        try {
          setLoading(true);
          const animals = await getRecentlyViewedAnimals(user.uid);
          setRecentAnimals(animals);
        } catch (error) {
          console.error("Error loading recent animals from Firestore:", error);
          setRecentAnimals([]);
        } finally {
          setLoading(false);
        }
      } else {
        // If not authenticated, try to load from localStorage as fallback
        try {
          const saved = localStorage.getItem("recentAnimals");
          if (saved) {
            setRecentAnimals(JSON.parse(saved));
          }
        } catch (error) {
          console.error("Error loading recent animals from localStorage:", error);
          setRecentAnimals([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecentAnimals();
  }, [user]);

  // Don't render the block if there are no recently viewed animals
  if (recentAnimals.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold nature-text mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Недавно просмотренные животные
        </motion.h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item} 
                className="nature-card animate-pulse"
              >
                <div className="bg-gray-300 dark:bg-gray-700 h-48 w-full rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {recentAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <AnimalCard animal={animal} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewedBlock;