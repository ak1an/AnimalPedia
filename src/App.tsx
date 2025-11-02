import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { Header } from './components/Header';
import { WelcomeSection } from './components/WelcomeSection';
import { DailyNews } from './components/DailyNews';
import { FactOfTheDay } from './components/FactOfTheDay';
import { AnimalOfTheDay } from './components/AnimalOfTheDay';
import { PopularAnimals } from './components/PopularAnimals';
import { MiniGames, MiniGamesMain } from './components/MiniGames';
import { Habitat } from './components/Habitat';
import { Animals } from './components/Animals';
import { ExtinctAnimals } from './components/ExtinctAnimals';
import { RecentlyViewedBlock } from './components/RecentlyViewed';
import { Favorites } from './components/Favorites';
import { CategoriesPage } from './components/Categories';
import { AboutPage } from './components/About';
import { AnimalDetails } from './components/AnimalDetails';
import CategoryPage from './components/Category/CategoryPage';
import { RedBookPage } from './components/RedBook';
import { HabitatFilter } from './components/HabitatFilter';
import { News } from './components/News';
import { Footer } from './components/Footer';
import AuthWrapper from './components/Auth/AuthWrapper';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { SearchResults } from './components/SearchResults';
import './index.css';
import ReviewsPage from './components/Reviews/ReviewsPage';
import SplashScreen from './components/SplashScreen';

// Create a component that uses Redux hooks
const AppContent: React.FC = () => {
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  useEffect(() => {
    // Apply theme class to body when component mounts or when theme changes
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 ease-in-out">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-20 transition-colors duration-300 ease-in-out">
        <Routes>
          <Route path="/" element={
            <>
              <WelcomeSection />
              <DailyNews />
              <FactOfTheDay />
              <AnimalOfTheDay />
              <PopularAnimals />
              <MiniGamesMain />
              <Habitat />
              <Animals />
              <ExtinctAnimals />
              <RecentlyViewedBlock />
            </>
          } />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/red-book" element={<RedBookPage />} />
          <Route path="/habitat-filter" element={<HabitatFilter />} />
          <Route path="/news" element={<News />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/games" element={<MiniGames />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/profile" element={<AuthWrapper />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/login" element={<AuthWrapper />} />
          <Route path="/register" element={<AuthWrapper />} />
          <Route path="/animal/:id" element={
            <>
              <AnimalDetails />
              <RecentlyViewedBlock />
            </>
          } />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

/**
 * Main App component for AnimalPedia
 * Demonstrates the usage of the Header component
 */
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <Router>
        <FavoriteProvider>
          <AppContent />
        </FavoriteProvider>
      </Router>
    </Provider>
  );
};

export default App;