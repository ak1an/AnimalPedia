import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimalCard from '../Categories/AnimalCard';
import mammalsData from '../../data/mammals.json';
import birdsData from '../../data/birds.json';
import reptilesData from '../../data/reptiles.json';
import amphibiansData from '../../data/amphibians.json';
import fishData from '../../data/fish.json';
import insectsData from '../../data/insects.json';
import extinctAnimalsData from '../../data/extinctAnimals.json';

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

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const [searchResults, setSearchResults] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Combine all animal data
    const allAnimals: Animal[] = [
      ...mammalsData,
      ...birdsData,
      ...reptilesData,
      ...amphibiansData,
      ...fishData,
      ...insectsData,
      ...extinctAnimalsData
    ];

    // Filter animals based on search query (case insensitive, partial match)
    const filteredAnimals = allAnimals.filter(animal => 
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredAnimals);
    setLoading(false);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Поиск животных...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="nature-button inline-flex items-center mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 transition-colors duration-300">
            Результаты поиска
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base transition-colors duration-300">
            По запросу "{searchQuery}" найдено {searchResults.length} животных
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {searchResults.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center transition-colors duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
              Ничего не найдено
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
              По запросу "{searchQuery}" не найдено ни одного животного. Попробуйте изменить поисковый запрос.
            </p>
            <button 
              onClick={() => navigate('/categories')}
              className="nature-button text-sm sm:text-base"
            >
              Посмотреть все категории
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;