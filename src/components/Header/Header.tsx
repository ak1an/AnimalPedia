import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Logo from './Logo';
import SearchBar from './SearchBar';
import NavMenu from './NavMenu';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

/**
 * Main Header component for AnimalPedia
 * Fixed header with logo, search, navigation, theme toggle, and user profile
 */
const Header: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.floating-burger')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out header">
        <div
          className={`container mx-auto px-2 sm:px-4 transition-all duration-300 ease-in-out ${
            scrolled
              ? isDarkMode
                ? 'h-14 bg-gray-900/90 shadow-lg backdrop-blur-md border-b border-gray-700'
                : 'h-14 bg-white/90 shadow-md backdrop-blur-md border-b border-gray-200'
              : isDarkMode
              ? 'h-16 md:h-20 bg-gray-900 backdrop-blur-sm border-b border-gray-800'
              : 'h-16 md:h-20 bg-white backdrop-blur-sm border-b border-gray-100'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${scrolled ? 'h-14' : 'h-16 md:h-20'}`}>
            {/* Left section: Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Center section: Search bar */}
            <div className="flex-1 mx-4 max-w-md lg:max-w-lg">
              <SearchBar />
            </div>

            {/* Right section: Navigation, Theme Toggle, and User Profile */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <NavMenu />
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Burger Menu for Mobile */}
      <div className="md:hidden">
        {/* Floating Burger Button */}
        <motion.button
          className="floating-burger fixed bottom-6 right-6 z-40 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
              />
              <motion.div
                className="mobile-menu fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 md:hidden rounded-t-2xl"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  {/* Logo */}
                  <div className="flex justify-center mb-6">
                    <Logo />
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mb-6">
                    <SearchBar />
                  </div>
                  
                  {/* Navigation Items */}
                  <div className="mb-6">
                    <NavMenu isMobile={true} closeMenu={closeMobileMenu} />
                  </div>
                  
                  {/* Theme Toggle and User Profile */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <span className="text-gray-700 dark:text-gray-300 mr-3">Тема:</span>
                      <ThemeToggle />
                    </div>
                    <UserProfile />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Header;