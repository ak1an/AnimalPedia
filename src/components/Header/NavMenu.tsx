import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaGamepad, FaHeart, FaNewspaper, FaBook, FaComments } from 'react-icons/fa';

interface NavMenuProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isMobile = false, closeMenu = () => {} }) => {
  const location = useLocation();

  const navItems = [
    { to: '/categories', label: 'Категории', icon: <FaBook /> },
    { to: '/habitat-filter', label: 'Среда обитания', icon: <FaBook /> },
    { to: '/red-book', label: 'Красная книга', icon: <FaBook /> },
    { to: '/games', label: 'Игры', icon: <FaGamepad /> },
    { to: '/news', label: 'Новости', icon: <FaNewspaper /> },
    { to: '/reviews', label: 'Отзывы', icon: <FaComments /> },
    { to: '/about', label: 'О нас', icon: <FaInfoCircle /> },
  ];

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
              location.pathname === item.to
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-green-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={closeMenu}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center ${
              location.pathname === item.to
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-green-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={closeMenu}
          >
            <span className="mr-1 sm:mr-2">{item.icon}</span>
            <span className="hidden lg:inline">{item.label}</span>
            <span className="lg:hidden">{item.label.substring(0, 1)}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden flex items-center">
        {/* This will be handled by the Header component now */}
      </div>
    </>
  );
};

export default NavMenu;