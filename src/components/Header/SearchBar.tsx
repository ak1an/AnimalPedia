import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setQuery, setSuggestions, setIsSearching } from '../../store/slices/searchSlice';
import { RootState } from '../../store';
import mammalsData from '../../data/mammals.json';
import birdsData from '../../data/birds.json';
import reptilesData from '../../data/reptiles.json';
import amphibiansData from '../../data/amphibians.json';
import fishData from '../../data/fish.json';
import insectsData from '../../data/insects.json';
import extinctAnimalsData from '../../data/extinctAnimals.json';

// Define the animal interface
interface Animal {
  id: string;
  name: string;
  category: string;
  photo: string;
  habitat: string;
  short: string;
  details: string;
  redBook?: boolean;
}

/**
 * SearchBar component with autocomplete functionality
 * Provides search suggestions as the user types
 */
const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query, suggestions, isSearching } = useSelector((state: RootState) => state.search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Handle clicks outside the search component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setQuery(value));
    
    if (value.length > 0) {
      dispatch(setIsSearching(true));
      // Filter animals based on input (case insensitive, partial match)
      const filtered = allAnimals.filter(animal => 
        animal.name.toLowerCase().includes(value.toLowerCase())
      );
      // Get unique animal names for suggestions
      const uniqueNames = Array.from(new Set(filtered.map(animal => animal.name)));
      dispatch(setSuggestions(uniqueNames.slice(0, 5))); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      dispatch(setIsSearching(false));
      dispatch(setSuggestions([]));
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setQuery(suggestion));
    setShowSuggestions(false);
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    // Navigate to search results page
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          placeholder="Поиск животных..."
          className="w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors duration-200"
        />
        <button 
          type="submit"
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto transition-all duration-200">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 sm:px-4 sm:py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-sm sm:text-base transition-colors duration-200"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading indicator */}
      {isSearching && suggestions.length === 0 && query.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200">
          <div className="px-3 py-2 sm:px-4 sm:py-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">Поиск...</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;