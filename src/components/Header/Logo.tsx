import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  logoUrl?: string; // необязательный URL, если не передан, будет дефолт
}

/**
 * Logo component for AnimalPedia
 * Returns user to the homepage when clicked
 */
const Logo: React.FC<LogoProps> = ({
  logoUrl = 'https://cdn-icons-png.flaticon.com/128/14684/14684285.png', // сюда ставь свой URL по умолчанию
}) => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      {/* Круг с изображением */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={logoUrl}
          alt="AnimalPedia Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xl font-bold text-gray-800 dark:text-white">
        AnimalPedia
      </span>
    </Link>
  );
};

export default Logo;
