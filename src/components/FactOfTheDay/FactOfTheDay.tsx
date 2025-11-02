import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Define the fact item type
interface FactItem {
  id: number;
  text: string;
  date: string;
  imageUrl: string;
}

// Define the stored data type
interface StoredFactData {
  date: string;
  fact: FactItem;
}

/**
 * FactOfTheDay component for AnimalPedia homepage
 * Displays a daily animal fact with automatic updates
 */
const FactOfTheDay: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [fact, setFact] = useState<FactItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock facts data - in a real app, this would come from an API
  const mockFactsData: FactItem[] = [
    {
      id: 1,
      text: "Осьминоги имеют три сердца и голубую кровь. Два сердца перекачивают кровь к жабрам, а третье - ко всему остальному телу.",
      date: "2025-10-28",
      imageUrl: "https://hi-news.ru/wp-content/uploads/2021/03/octopus_mind_image_one.jpg"
    },
    {
      id: 2,
      text: "Слонята могут понимать указания на человеческом языке жестов. Они способны следовать даже сложным указаниям, подобно собакам и детям.",
      date: "2025-10-27",
      imageUrl: "https://media.istockphoto.com/id/1470158407/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%BB%D0%BE%D0%BD%D0%B5%D0%BD%D0%BE%D0%BA-%D1%82%D0%B0%D0%BD%D1%86%D1%83%D0%B5%D1%82-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%BE%D1%87%D0%B8%D0%BD%D0%B5-%D1%81%D0%BC%D0%BE%D0%BB%D1%8F%D0%BD%D0%BE%D0%B9-%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B8.jpg?s=612x612&w=0&k=20&c=b72UG7AFthPndLjYkBZ1euqtasU-eBhCVo5-DgF5e0A="
    },
    {
      id: 3,
      text: "Колибри - единственная птица, способная летать назад. Их крылья могут взмахивать до 80 раз в секунду.",
      date: "2025-10-26",
      imageUrl: "https://ethnomir.ru/upload/medialibrary/77b/kolibri.jpg"
    },
    {
      id: 4,
      text: "Акулы существуют дольше, чем деревья. Самые древние акулы появились около 400 миллионов лет назад.",
      date: "2025-10-25",
      imageUrl: "https://optim.tildacdn.com/tild6465-3030-4034-a661-626131323461/-/format/webp/akuly-kladoselahii.jpg.webp"
    },
    {
      id: 5,
      text: "Пингвины делают подарки друг другу в виде красивых камешков. Это поведение наблюдается во время ухаживания.",
      date: "2025-10-24",
      imageUrl: "https://images.techinsider.ru/upload/img_cache/63b/63bf641d5587fa55e13956363ede646d_ce_2000x1053x0x140_cropped_1200x628.png"
    },
    {
      id: 6,
      text: "Медузы существуют уже более 500 миллионов лет, что делает их одними из самых древних многоклеточных существ на Земле.",
      date: "2025-10-23",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo-RoSNUy497C1RoWGa7HijAGK1qmmiIkWng&s"
    },
    {
      id: 7,
      text: "Хамелеоны могут двигать глазами независимо друг от друга, что позволяет им смотреть в двух направлениях одновременно.",
      date: "2025-10-22",
      imageUrl: "https://api.zapovednik96.ru/articles/%D1%85%D0%B0%D0%BC%D0%B5%D0%BB%D0%B5%D0%BE%D0%BD.jpg"
    },
    {
      id: 8,
      text: "Морские котики могут задерживать дыхание до двух часов и погружаться на глубину более 1700 метров.",
      date: "2025-10-21",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAbMqra4wRTDZy_q_lWbuh8nuBE7s6AOK-0Q&s"
    }
  ];

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to select a random fact
  const selectRandomFact = (factsArray: FactItem[]): FactItem => {
    const randomIndex = Math.floor(Math.random() * factsArray.length);
    return factsArray[randomIndex];
  };

  // Function to simulate fetching fact from an API
  const fetchFact = async (): Promise<FactItem> => {
    // In a real implementation, this would be an API call:
    // const response = await fetch('https://api.animalpedia.com/fact-of-the-day');
    // const data = await response.json();
    // return data;
    
    // For now, we'll use mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(selectRandomFact(mockFactsData));
      }, 300); // Simulate network delay
    });
  };

  // Effect to load fact on component mount
  useEffect(() => {
    const loadFact = async () => {
      try {
        setLoading(true);
        
        // Check if we have stored data for today
        const storedData = localStorage.getItem('factOfTheDay');
        const currentDate = getCurrentDate();
        
        if (storedData) {
          const parsedData: StoredFactData = JSON.parse(storedData);
          
          // If stored data is from today, use it
          if (parsedData.date === currentDate) {
            setFact(parsedData.fact);
            setLoading(false);
            return;
          }
        }
        
        // If no stored data or data is outdated, fetch new fact
        const factData = await fetchFact();
        
        // Update fact date to current date
        const updatedFact = {
          ...factData,
          date: currentDate
        };
        
        // Store the new fact with today's date
        const dataToStore: StoredFactData = {
          date: currentDate,
          fact: updatedFact
        };
        localStorage.setItem('factOfTheDay', JSON.stringify(dataToStore));
        
        setFact(updatedFact);
      } catch (error) {
        console.error("Failed to load fact:", error);
        // Fallback to mock data if API fails
        const randomFact = selectRandomFact(mockFactsData);
        const currentDate = getCurrentDate();
        const updatedFact = {
          ...randomFact,
          date: currentDate
        };
        setFact(updatedFact);
      } finally {
        setLoading(false);
      }
    };

    loadFact();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) {
    return (
      <section className={`py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Интересный факт дня</h2>
          </div>
          
          <div className="max-w-4xl mx-auto nature-card animate-pulse">
            <div className="md:flex">
              <div className="md:w-2/5">
                <div className={`h-64 w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <div className={`h-6 rounded w-3/4 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-full mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-2/3 mb-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Интересный факт дня</h2>
        </div>
        
        <div className="max-w-4xl mx-auto nature-card animate-fade-in">
          <div className="md:flex">
            <div className="md:w-2/5">
              <img 
                src={fact?.imageUrl} 
                alt="Animal fact illustration" 
                className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none animate-fade-in-up"
              />
            </div>
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              <p className={`text-lg mb-6 animate-fade-in-up delay-100 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {fact?.text}
              </p>
              <div className={`flex items-center animate-fade-in-up delay-200 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {fact && formatDate(fact.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactOfTheDay;