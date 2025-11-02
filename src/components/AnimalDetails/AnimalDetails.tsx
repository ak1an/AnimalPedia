import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { auth } from '../../firebase/config';
import { addRecentlyViewedAnimal } from '../../firebase/userOperations';

// Define the Animal interface
interface Animal {
  id: string | number;
  name: string;
  category: string;
  habitat: string;
  photo: string;
  short?: string;
  details?: string;
  description?: string;
  diet?: string;
  sleep?: string;
  facts?: string[];
}

// Import data files
import mammalsData from '../../data/mammals.json';
import birdsData from '../../data/birds.json';
import reptilesData from '../../data/reptiles.json';
import amphibiansData from '../../data/amphibians.json';
import fishData from '../../data/fish.json';
import insectsData from '../../data/insects.json';
import extinctAnimalsData from '../../data/extinctAnimals.json';

const AnimalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user] = useAuthState(auth);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to add animal to recent list in Firestore
  const addToRecent = async (animal: Animal) => {
    if (user) {
      try {
        // Add to Firestore
        await addRecentlyViewedAnimal(user.uid, {
          id: animal.id.toString(),
          name: animal.name,
          category: animal.category,
          habitat: animal.habitat,
          photo: animal.photo,
          short: animal.short || '',
          details: animal.details || ''
        });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("recentAnimals");
          let recentAnimals: Animal[] = saved ? JSON.parse(saved) : [];
          
          // Remove duplicates
          const filtered = recentAnimals.filter(a => a.id !== animal.id.toString());
          
          // Add current animal to the beginning
          const updated = [
            {
              id: animal.id.toString(),
              name: animal.name,
              category: animal.category,
              habitat: animal.habitat,
              photo: animal.photo,
              short: animal.short || '',
              details: animal.details || ''
            },
            ...filtered
          ].slice(0, 5); // Keep only the last 5 animals
          
          // Save to localStorage
          localStorage.setItem("recentAnimals", JSON.stringify(updated));
        } catch (localStorageError) {
          console.error("Error saving to localStorage:", localStorageError);
        }
      }
    } else {
      // If not authenticated, use localStorage
      try {
        const saved = localStorage.getItem("recentAnimals");
        let recentAnimals: Animal[] = saved ? JSON.parse(saved) : [];
        
        // Remove duplicates
        const filtered = recentAnimals.filter(a => a.id !== animal.id.toString());
        
        // Add current animal to the beginning
        const updated = [
          {
            id: animal.id.toString(),
            name: animal.name,
            category: animal.category,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short || '',
            details: animal.details || ''
          },
          ...filtered
        ].slice(0, 5); // Keep only the last 5 animals
        
        // Save to localStorage
        localStorage.setItem("recentAnimals", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  useEffect(() => {
    // Find animal by ID across all data files
    const allAnimals = [
      ...mammalsData,
      ...birdsData,
      ...reptilesData,
      ...amphibiansData,
      ...fishData,
      ...insectsData,
      ...extinctAnimalsData
    ];
    
    const foundAnimal = allAnimals.find((animal) => 
      animal.id.toString() === id
    );
    
    if (foundAnimal) {
      setAnimal(foundAnimal);
      // Add animal to recently viewed list
      addToRecent(foundAnimal);
    }
    
    setLoading(false);
  }, [id, user]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically dispatch an action to Redux store
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically dispatch an action to Redux store
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Загрузка информации о животном...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Животное не найдено</h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              К сожалению, информация о животном с ID "{id}" не найдена.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use either short or description as the main description
  const animalDescription = animal.details || animal.description || animal.short || "Описание отсутствует";

  // Function to get category name in Russian
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'mammals': return 'Млекопитающие';
      case 'birds': return 'Птицы';
      case 'reptiles': return 'Рептилии';
      case 'amphibians': return 'Амфибии';
      case 'fish': return 'Рыбы';
      case 'insects': return 'Насекомые';
      case 'extinctAnimals': return 'Вымершие животные';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
          {/* Animal Header */}
          <div className="relative">
            <img 
              src={animal.photo} 
              alt={animal.name} 
              className="w-full h-96 object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2 transition-colors duration-300">{animal.name}</h1>
              <p className="text-xl transition-colors duration-300">
                <span className="font-semibold">Категория:</span> {getCategoryName(animal.category)}
              </p>
              <p className="text-xl transition-colors duration-300">
                <span className="font-semibold">Среда обитания:</span> {animal.habitat}
              </p>
            </div>
          </div>

          {/* Animal Details */}
          <div className="p-8 transition-colors duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Описание</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
                {animalDescription}
              </p>
            </div>

            {/* Additional Information */}
            {(animal.diet || animal.sleep || (animal.facts && animal.facts.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {animal.diet && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">Питание</h3>
                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{animal.diet}</p>
                  </div>
                )}
                {animal.sleep && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">Образ жизни</h3>
                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{animal.sleep}</p>
                  </div>
                )}
              </div>
            )}

            {/* Facts */}
            {animal.facts && animal.facts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Интересные факты</h3>
                <ul className="space-y-3">
                  {animal.facts.map((fact, index) => (
                    <li 
                      key={index} 
                      className="flex items-start bg-gray-100 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-300"
                    >
                      <span className="text-green-500 mr-2 text-xl">•</span>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <button 
                onClick={handleLike}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  isLiked 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FaStar className={`mr-2 ${isLiked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                {isLiked ? 'Лайкнут' : 'Лайк'}
              </button>
              
              <button 
                onClick={handleFavorite}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  isFavorited 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FaHeart className={`mr-2 ${isFavorited ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                {isFavorited ? 'В избранном' : 'В избранное'}
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="nature-button px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;