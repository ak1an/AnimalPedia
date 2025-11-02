import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, Transition } from 'framer-motion';
import AnimalCard from '../Categories/AnimalCard';
import MammalsLogo from './logos/MammalsLogo';
import BirdsLogo from './logos/BirdsLogo';
import ReptilesLogo from './logos/ReptilesLogo';
import AmphibiansLogo from './logos/AmphibiansLogo';
import FishLogo from './logos/FishLogo';
import InsectsLogo from './logos/InsectsLogo';
import ExtinctLogo from './logos/ExtinctLogo';

// Define the animal interface
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

// Define the category interface
interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define categories
  const categories: Category[] = [
    { 
      id: 'mammals', 
      name: 'Млекопитающие', 
      icon: MammalsLogo,
      color: 'text-amber-600',
      bgColor: 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800'
    },
    { 
      id: 'birds', 
      name: 'Птицы', 
      icon: BirdsLogo,
      color: 'text-blue-600',
      bgColor: 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
    },
    { 
      id: 'reptiles', 
      name: 'Рептилии', 
      icon: ReptilesLogo,
      color: 'text-green-600',
      bgColor: 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
    },
    { 
      id: 'amphibians', 
      name: 'Амфибии', 
      icon: AmphibiansLogo,
      color: 'text-cyan-600',
      bgColor: 'from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800'
    },
    { 
      id: 'fish', 
      name: 'Рыбы', 
      icon: FishLogo,
      color: 'text-sky-600',
      bgColor: 'from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800'
    },
    { 
      id: 'insects', 
      name: 'Насекомые', 
      icon: InsectsLogo,
      color: 'text-red-600',
      bgColor: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'
    },
    { 
      id: 'extinct', 
      name: 'Вымершие животные', 
      icon: ExtinctLogo,
      color: 'text-purple-600',
      bgColor: 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
    }
  ];

  // Find current category
  const currentCategory = categories.find(cat => cat.id === categoryId) || categories[0];

  // Load animals based on category
  useEffect(() => {
    const importAnimalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Animal[] = [];
        
        switch (categoryId) {
          case 'mammals':
            const mammals = await import('../../data/mammals.json');
            data = mammals.default;
            break;
          case 'birds':
            const birds = await import('../../data/birds.json');
            data = birds.default;
            break;
          case 'reptiles':
            const reptiles = await import('../../data/reptiles.json');
            data = reptiles.default;
            break;
          case 'amphibians':
            const amphibians = await import('../../data/amphibians.json');
            data = amphibians.default;
            break;
          case 'fish':
            const fish = await import('../../data/fish.json');
            data = fish.default;
            break;
          case 'insects':
            const insects = await import('../../data/insects.json');
            data = insects.default;
            break;
          case 'extinct':
            const extinct = await import('../../data/extinctAnimals.json');
            data = extinct.default;
            break;
          default:
            setError('Категория не найдена');
            data = [];
        }
        
        setAnimals(data);
      } catch (err) {
        console.error('Error loading animal data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      importAnimalData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Загрузка категории...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center transition-colors duration-300">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Ошибка</h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render the logo component
  const LogoComponent = currentCategory.icon;

  // Animation variants for animal cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <div className={`min-h-screen py-8 sm:py-12 transition-colors duration-300 ${currentCategory.bgColor}`}>
      <div className="container mx-auto px-2 sm:px-4">
        {/* Category Header */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 text-center border border-white/20 dark:border-gray-700/50 transition-all duration-300"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as Transition}
        >
          <motion.div 
            className="flex justify-center mb-4 sm:mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 } as Transition}
          >
            <LogoComponent className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
          </motion.div>
          <motion.h1 
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 ${currentCategory.color} transition-colors duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 } as Transition}
          >
            {currentCategory.name}
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 } as Transition}
          >
            {animals.length} животных в этой категории
          </motion.p>
        </motion.div>

        {/* Animal Grid */}
        {animals.length > 0 ? (
          <motion.div 
            className="mb-8 sm:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {animals.map((animal: Animal, index) => (
                <motion.div
                  key={animal.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * index } as Transition}
                >
                  <AnimalCard animal={animal} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-white/20 dark:border-gray-700/50 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 } as Transition}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Животные не найдены</h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              В категории "{currentCategory.name}" пока нет животных.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;