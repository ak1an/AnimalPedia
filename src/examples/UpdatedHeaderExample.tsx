import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Header, Logo, SearchBar, NavMenu, ThemeToggle, UserProfile } from '../components/Header';

const UpdatedHeaderExample: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Updated Header Component Example
          </h1>
          
          {/* Full Header Component */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Full Header Implementation
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <Header />
            </div>
          </div>
          
          {/* Individual Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Logo Component
              </h2>
              <div className="flex justify-center">
                <Logo />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                SearchBar Component
              </h2>
              <div className="flex justify-center">
                <SearchBar />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                NavMenu Component
              </h2>
              <div className="flex justify-center">
                <NavMenu />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                ThemeToggle Component
              </h2>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {/* Implementation Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Implementation Notes
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                All components are built with modularity in mind. Each sub-component 
                (Logo, SearchBar, NavMenu, ThemeToggle, UserProfile) can be used independently 
                or together as part of the full Header.
              </p>
              <p>
                State management is handled through Redux Toolkit slices, making it easy to 
                extend functionality or modify behavior.
              </p>
              <p>
                Styling uses TailwindCSS with full dark mode support. All components adapt 
                to the current theme automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default UpdatedHeaderExample;