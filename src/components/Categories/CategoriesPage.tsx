import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Transition } from 'framer-motion';
import CategoryBlock from './CategoryBlock';

// Define category interface
interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [categories] = useState<Category[]>([
    { 
      id: 'mammals', 
      name: 'Млекопитающие', 
      icon: () => null, // Will be replaced in CategoryBlock
      color: 'text-amber-600',
      bgColor: 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800'
    },
    { 
      id: 'birds', 
      name: 'Птицы', 
      icon: () => null,
      color: 'text-blue-600',
      bgColor: 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
    },
    { 
      id: 'reptiles', 
      name: 'Рептилии', 
      icon: () => null,
      color: 'text-green-600',
      bgColor: 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
    },
    { 
      id: 'amphibians', 
      name: 'Амфибии', 
      icon: () => null,
      color: 'text-cyan-600',
      bgColor: 'from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800'
    },
    { 
      id: 'fish', 
      name: 'Рыбы', 
      icon: () => null,
      color: 'text-sky-600',
      bgColor: 'from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800'
    },
    { 
      id: 'insects', 
      name: 'Насекомые', 
      icon: () => null,
      color: 'text-red-600',
      bgColor: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'
    },
    { 
      id: 'extinct', 
      name: 'Вымершие животные', 
      icon: () => null,
      color: 'text-purple-600',
      bgColor: 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
    },
  ]);

  const handleCategorySelect = (categoryId: string) => {
    // Navigation is handled in CategoryBlock
    console.log('Selected category:', categoryId);
  };

  // Animation variants
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-4">
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-3 sm:mb-4 transition-colors duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as Transition}
        >
          Категории животных
        </motion.h1>
        <motion.p 
          className="text-center text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base transition-colors duration-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 } as Transition}
        >
          Выберите категорию животных, чтобы узнать о них больше
        </motion.p>

        {/* Category Blocks with improved layout */}
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top row - 4 items */}
          <motion.div 
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full max-w-6xl"
            variants={itemVariants}
          >
            {categories.slice(0, 4).map((category) => (
              <CategoryBlock
                key={category.id}
                category={category}
                isSelected={false}
                onSelect={handleCategorySelect}
              />
            ))}
          </motion.div>
          
          {/* Bottom row - 3 items, centered */}
          <motion.div 
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl justify-center"
            variants={itemVariants}
          >
            {categories.slice(4).map((category) => (
              <CategoryBlock
                key={category.id}
                category={category}
                isSelected={false}
                onSelect={handleCategorySelect}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesPage;