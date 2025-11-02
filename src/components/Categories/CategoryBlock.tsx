import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import logos
import MammalsLogo from '../Category/logos/MammalsLogo';
import BirdsLogo from '../Category/logos/BirdsLogo';
import ReptilesLogo from '../Category/logos/ReptilesLogo';
import AmphibiansLogo from '../Category/logos/AmphibiansLogo';
import InsectsLogo from '../Category/logos/InsectsLogo';
import ExtinctLogo from '../Category/logos/ExtinctLogo';
import FishLogo from '../Category/logos/FishLogo';

interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface CategoryBlockProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({ category, isSelected, onSelect }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    onSelect(category.id);
    navigate(`/category/${category.id}`);
  };

  // Map category IDs to logo components
  const getLogoComponent = () => {
    switch (category.id) {
      case 'mammals': return MammalsLogo;
      case 'birds': return BirdsLogo;
      case 'reptiles': return ReptilesLogo;
      case 'amphibians': return AmphibiansLogo;
      case 'fish': return FishLogo;
      case 'insects': return InsectsLogo;
      case 'extinct': return ExtinctLogo;
      default: return MammalsLogo;
    }
  };

  const LogoComponent = getLogoComponent();

  return (
    <motion.div 
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg cursor-pointer border border-white/30 dark:border-gray-700/50 ${
        isSelected ? 'ring-2 sm:ring-4 ring-green-500' : ''
      }`}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`bg-gradient-to-br ${category.bgColor} p-4 sm:p-6 md:p-8 h-full flex flex-col items-center justify-center transition-all duration-300 hover:brightness-105`}>
        <motion.div 
          className="mb-4 sm:mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LogoComponent className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
        </motion.div>
        <motion.h3 
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white text-center"
          whileHover={{ color: "#111827" }}
          transition={{ duration: 0.2 }}
        >
          {category.name}
        </motion.h3>
      </div>
    </motion.div>
  );
};

export default CategoryBlock;