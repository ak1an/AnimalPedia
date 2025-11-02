import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

/**
 * WelcomeSection component for AnimalPedia homepage
 * Displays a welcoming message with a call-to-action button
 */
const WelcomeSection: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`py-16 md:py-24 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4 text-center">
        {/* Animated heading */}
        <h1 
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 ease-out ${
            isDarkMode ? 'text-white' : 'nature-text'
          } ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          Добро пожаловать в AnimalPedia
        </h1>
        
        {/* Animated subtitle */}
        <p 
          className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto transition-all duration-700 ease-out delay-150 ${
            isDarkMode ? 'text-gray-300' : 'nature-text-light'
          } ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          Исследуйте удивительный мир животных, узнавайте интересные факты и следите за редкими видами в их естественной среде обитания
        </p>
        
        {/* Animated button */}
        <Link 
          to="/categories"
          className={`inline-block nature-button px-8 py-4 font-semibold rounded-full shadow-lg transform transition-all duration-500 ease-out delay-300 ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-6 scale-95'
          } hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
        >
          Начать изучать
        </Link>
      </div>
    </section>
  );
};

export default WelcomeSection;