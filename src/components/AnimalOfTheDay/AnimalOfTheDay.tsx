import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addFavoriteAnimal, removeFavoriteAnimal } from '../../store/slices/userSlice';
import { addRecentlyViewedAnimal } from '../../store/slices/recentlyViewedSlice';
import { RootState } from '../../store';

// Define the animal item type
interface AnimalItem {
  id: number;
  name: string;
  habitat: string;
  fact: string;
  redBookStatus: string | null;
  description: string;
  imageUrl: string;
}

// Define the stored data type
interface StoredAnimalData {
  date: string;
  animal: AnimalItem;
}

/**
 * AnimalOfTheDay component for AnimalPedia homepage
 * Displays a daily animal with automatic updates
 */
const AnimalOfTheDay: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [animal, setAnimal] = useState<AnimalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock animals data - in a real app, this would come from an API
  const mockAnimalsData: AnimalItem[] = [
    {
      id: 1,
      name: "Амурский тигр",
      habitat: "Дальний Восток России, Китай, Северная Корея",
      fact: "Амурский тигр - самый крупный подвид тигра в мире. Самцы могут весить до 300 кг.",
      redBookStatus: "Вид восстанавливается",
      description: "Амурский тигр, также известный как уссурийский тигр, является самым крупным подвидом тигра в мире. Эти величественные хищники обитают в лесах Дальнего Востока России, а также в северо-восточном Китае и возможно в Северной Корее. Амурские тигры могут достигать длины до 3,3 метров и весить до 300 кг. Их толстая шерсть и слой подкожного жира позволяют выживать в суровых зимних условиях. Благодаря усилиям по охране численность амурских тигров постепенно увеличивается, и они были переведены из категории вымирающих в категорию видов, численность которых восстанавливается.",
       imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWOr6vUaNjQPHVn-3HUh7OQEUe1Dzxzz8Pg&s"
    },
    {
      id: 2,
      name: "Снежный барс",
      habitat: "Горные районы Центральной и Южной Азии",
      fact: "Снежный барс может прыгать на расстояние до 15 метров в длину.",
      redBookStatus: "Уязвимый вид",
      description: "Снежный барс, также известный как ирбис, обитает в горных районах Центральной и Южной Азии, включая Гималаи, Памир и Тянь-Шань. Этот великолепный хищник приспособлен к жизни в суровых горных условиях: его густая шерсть защищает от холода, а широкие лапы действуют как снегоступы. Снежный барс может прыгать на расстояние до 15 метров в длину и на высоту до 6 метров. Его длинный пушистый хвост (до 1 метра) используется как балансир при прыжках и как шарф для защиты от холода. Из-за утраты среды обитания и браконьерства численность снежных барсов сокращается, и они занесены в Красную книгу как уязвимый вид.",
      imageUrl: "https://ic.pics.livejournal.com/alexeyosokin/55047576/1117749/1117749_original.jpg"
    },
    {
      id: 3,
      name: "Горилла",
      habitat: "Горные леса Центральной Африки",
      fact: "Гориллы обладают интеллектом, сравнимым с интеллектом трехлетнего ребенка.",
      redBookStatus: "Вид восстанавливается",
      description: "Гориллы - самые крупные приматы на Земле. Они обитают в горных лесах Центральной Африки, включая Руанду, Уганду и Восточную Демократическую Республику Конго. Несмотря на свое грозное внешность, гориллы в основном питаются растениями и являются миролюбивыми животными. Они живут в социальных группах под руководством доминирующего самца, известного как серебристая спина. Гориллы обладают высоким интеллектом и могут использовать инструменты, решать простые задачи и даже изучать язык жестов. Благодаря усилиям по охране и контролю браконьерства, численность горилл постепенно восстанавливается, и они были переведены из категории вымирающих в категорию видов, численность которых восстанавливается.",
      imageUrl: "https://i.bigenc.ru/resizer/resize?sign=fjD2JErLTjDcu959zGBsZA&filename=vault/d2665b380240df07ef06e4e0fafcf827.webp&width=1200"
    },
    {
      id: 4,
      name: "Синий кит",
      habitat: "Океаны по всему миру",
      fact: "Синий кит - самое крупное животное, когда-либо существовавшее на Земле.",
      redBookStatus: "Вид восстанавливается",
      description: "Синий кит - действительно гигант среди животных. Эти морские млекопитающие могут достигать длины до 30 метров и весить до 200 тонн. Их сердце весит столько же, сколько автомобиль, а язык - столько же, сколько слон. Несмотря на свои огромные размеры, синие киты питаются крилем - крошечными ракообразными, которых они процеживают через свои усовые пластинки. После почти полного исчезновения из-за промысла в начале XX века, численность синих китов постепенно восстанавливается благодаря международным соглашениям о запрете китобойного промысла. Сегодня в мировом океане насчитывается около 25 000 особей.",
      imageUrl: "https://cdn.divessi.com/cached/Wildlife_Blue_Whale_Alamy-Nature-Picture-Library.jpg/600.jpg"
    },
    {
      id: 5,
      name: "Панда большая",
      habitat: "Бамбуковые леса Центрального Китая",
      fact: "Панды проводят 12-16 часов в день за поеданием бамбука.",
      redBookStatus: "Уязвимый вид",
      description: "Большая панда - символ охраны природы и одного из самых успешных программ по спасению исчезающих видов. Эти милые животные обитают в бамбуковых лесах горных районов Центрального Китая. Несмотря на принадлежность к отряду хищных, панды питаются почти исключительно бамбуком, съедая до 12-38 кг в день. Их 'лишние' большие пальцы помогают захватывать стебли бамбука. У панд очень медленный обмен веществ, и они мало двигаются, чтобы экономить энергию. Благодаря усилиям Китая и международного сообщества, численность панд постепенно увеличивается, и они были переведены из категории вымирающих в категорию уязвимых видов.",
      imageUrl: "https://data.chinahighlights.ru/information-view/information/word_img/4e19c2e71580c74b426ffec1216b3cd4.jpg"
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

  // Function to select a random animal
  const selectRandomAnimal = (animalsArray: AnimalItem[]): AnimalItem => {
    const randomIndex = Math.floor(Math.random() * animalsArray.length);
    return animalsArray[randomIndex];
  };

  // Function to simulate fetching animal from an API
  const fetchAnimal = async (): Promise<AnimalItem> => {
    // In a real implementation, this would be an API call:
    // const response = await fetch('https://api.animalpedia.com/animal-of-the-day');
    // const data = await response.json();
    // return data;
    
    // For now, we'll use mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(selectRandomAnimal(mockAnimalsData));
      }, 300); // Simulate network delay
    });
  };

  // Effect to load animal on component mount
  useEffect(() => {
    const loadAnimal = async () => {
      try {
        setLoading(true);
        
        // Check if we have stored data for today
        const storedData = localStorage.getItem('animalOfTheDay');
        const currentDate = getCurrentDate();
        
        if (storedData) {
          const parsedData: StoredAnimalData = JSON.parse(storedData);
          
          // If stored data is from today, use it
          if (parsedData.date === currentDate) {
            setAnimal(parsedData.animal);
            
            // Add animal to recently viewed
            const animalForRecentlyViewed = {
              id: parsedData.animal.id.toString(),
              name: parsedData.animal.name,
              category: "animalOfTheDay",
              habitat: parsedData.animal.habitat,
              photo: parsedData.animal.imageUrl,
              short: parsedData.animal.fact,
              details: parsedData.animal.description
            };
            dispatch(addRecentlyViewedAnimal(animalForRecentlyViewed));
            
            // Set initial favorite status based on user's favorites
            if (user.isAuthenticated && user.favoriteAnimals.includes(parsedData.animal.id.toString())) {
              setIsFavorite(true);
            } else {
              setIsFavorite(false);
            }
            
            setLoading(false);
            return;
          }
        }
        
        // If no stored data or data is outdated, fetch new animal
        const animalData = await fetchAnimal();
        
        // Store the new animal with today's date
        const dataToStore: StoredAnimalData = {
          date: currentDate,
          animal: animalData
        };
        localStorage.setItem('animalOfTheDay', JSON.stringify(dataToStore));
        
        // Add animal to recently viewed
        const animalForRecentlyViewed = {
          id: animalData.id.toString(),
          name: animalData.name,
          category: "animalOfTheDay",
          habitat: animalData.habitat,
          photo: animalData.imageUrl,
          short: animalData.fact,
          details: animalData.description
        };
        dispatch(addRecentlyViewedAnimal(animalForRecentlyViewed));
        
        // Set initial favorite status based on user's favorites
        if (user.isAuthenticated && user.favoriteAnimals.includes(animalData.id.toString())) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
        
        setAnimal(animalData);
      } catch (error) {
        console.error("Failed to load animal:", error);
        // Fallback to mock data if API fails
        const randomAnimal = selectRandomAnimal(mockAnimalsData);
        setAnimal(randomAnimal);
      } finally {
        setLoading(false);
      }
    };

    loadAnimal();
  }, [user, dispatch]);

  // Handle adding/removing from favorites
  const toggleFavorite = async () => {
    // Check if user is authenticated
    if (!user.isAuthenticated) {
      alert('Авторизуйтесь, чтобы добавлять в избранное');
      return;
    }
    
    if (!animal) return;
    
    try {
      const animalId = animal.id.toString();
      const userDocRef = doc(db, 'users', user.uid!);
      
      // Toggle favorite status
      const newFavoriteStatus = !isFavorite;
      
      // Update Firestore
      if (newFavoriteStatus) {
        // Add to favorites
        await updateDoc(userDocRef, {
          favoriteAnimals: arrayUnion(animalId)
        });
        // Update Redux store
        dispatch(addFavoriteAnimal(animalId));
      } else {
        // Remove from favorites
        await updateDoc(userDocRef, {
          favoriteAnimals: arrayRemove(animalId)
        });
        // Update Redux store
        dispatch(removeFavoriteAnimal(animalId));
      }
      
      // Update local state
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Ошибка при обновлении избранного');
    }
  };

  // Handle opening the modal with full animal info
  const openModal = () => {
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section className={`py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Животное дня</h2>
          </div>
          
          <div className="max-w-4xl mx-auto nature-card animate-pulse">
            <div className="md:flex">
              <div className="md:w-2/5">
                <div className={`h-64 w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <div className={`h-8 rounded w-3/4 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-full mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-full mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-2/3 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-full mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="flex space-x-4">
                  <div className={`h-10 rounded w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-10 rounded w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
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
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Животное дня</h2>
        </div>
        
        <div className="max-w-4xl mx-auto nature-card animate-fade-in">
          <div className="md:flex">
            <div className="md:w-2/5">
              <img 
                src={animal?.imageUrl} 
                alt={animal?.name} 
                className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none animate-fade-in-up"
              />
            </div>
            <div className="md:w-3/5 p-8 flex flex-col">
              <h3 className={`text-2xl font-bold mb-2 animate-fade-in-up transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {animal?.name}
              </h3>
              
              <div className="mb-4 animate-fade-in-up delay-100">
                <div className={`flex items-center mb-1 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{animal?.habitat}</span>
                </div>
                
                {animal?.redBookStatus && (
                  <div className={`flex items-center transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{animal.redBookStatus}</span>
                  </div>
                )}
              </div>
              
              <p className={`mb-6 animate-fade-in-up delay-200 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {animal?.fact}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-auto animate-fade-in-up delay-300">
                <button 
                  onClick={toggleFavorite}
                  className={`nature-button flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </button>
                
                <button 
                  onClick={openModal}
                  className="nature-button flex items-center"
                >
                  Подробнее
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying full animal info */}
      {isModalOpen && animal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="nature-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-pop rounded-2xl">
            <div className="relative">
              <img 
                src={animal.imageUrl} 
                alt={animal.name} 
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={closeModal}
                className={`absolute top-4 right-4 rounded-full p-2 shadow-lg hover:bg-opacity-80 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-800'
                }`}
                aria-label="Закрыть"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{animal.name}</h3>
              
              <div className="mb-6">
                <div className={`flex items-center mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Место обитания:</strong> {animal.habitat}</span>
                </div>
                
                {animal.redBookStatus && (
                  <div className={`flex items-center transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span><strong>Статус в Красной книге:</strong> {animal.redBookStatus}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Интересный факт</h4>
                <p className={`transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{animal.fact}</p>
              </div>
              
              <div>
                <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Описание</h4>
                <p className={`whitespace-pre-line transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{animal.description}</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={toggleFavorite}
                  className={`nature-button flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnimalOfTheDay;