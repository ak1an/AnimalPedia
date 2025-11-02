import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Define the news item type
interface NewsItem {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

// Define the stored data type
interface StoredNewsData {
  date: string;
  news: NewsItem[];
}

/**
 * DailyNews component for AnimalPedia homepage
 * Displays daily animal and nature news with automatic updates
 */
const DailyNews: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock news data with full content - in a real app, this would come from an API
  const mockNewsData: NewsItem[] = [
    {
      id: 1,
      title: "Новые исследования о миграции птиц",
      content: "Ученые обнаружили удивительные закономерности в миграционных путях птиц через Тихий океан. Новые спутниковые данные показывают, что некоторые виды птиц способны преодолевать расстояния более 11 000 километров без единой остановки. Это открытие может изменить наше понимание способностей пернатых к длительному полету и их навигационных способностей.",
      excerpt: "Ученые обнаружили удивительные закономерности в миграционных путях птиц через Тихий океан.",
      date: "2025-10-28",
      imageUrl: "https://cdnuploads.aa.com.tr/uploads/Contents/2023/05/12/thumbs_b_c_6052643e78d979d1b53715e7083ac51a.jpg?v=131410"
    },
    {
      id: 2,
      title: "Открытие нового вида амфибий",
      content: "Биологи описали новый вид лягушки в тропических лесах Амазонии. Новый вид, получивший название Hyloscirtus amazonicus, отличается яркой окраской и уникальным звонким голосом. Ученые полагают, что это открытие может свидетельствовать о большем биоразнообразии в регионе, чем предполагалось ранее. Вид обитает только в определенной части бассейна Амазонки и может быть уязвим для изменений климата.",
      excerpt: "Биологи описали новый вид лягушки в тропических лесах Амазонии.",
      date: "2025-10-27",
      imageUrl: "https://focus.ua/static/storage/thumbs/920x465/1/35/4dmotu-cad8e5519e8cf4aac0fc201144526351.jpg?v=0576_1"
    },
    {
      id: 3,
      title: "Восстановление популяции тигров",
      content: "Программа сохранения тигров показывает положительные результаты в Индии. За последние пять лет численность тигров в национальных парках Индии увеличилась на 30%. Это стало возможным благодаря совместным усилиям правительства, неправительственных организаций и местных сообществ. В рамках программы были ужесточены меры по борьбе с браконьерством, а также восстановлены природные коридоры для миграции животных.",
      excerpt: "Программа сохранения тигров показывает положительные результаты в Индии.",
      date: "2025-10-26",
      imageUrl: "https://total.kz/storage/f8/f846bfac4e34985667ffdd25aea451eb_resize_w_830_h_465.jpg"
    },
    {
      id: 4,
      title: "Изменения климата и морские млекопитающие",
      content: "Наблюдается смещение ареалов обитания морских котиков из-за потепления океана. Исследования показывают, что популяции морских котиков перемещаются на север в поисках более холодных вод. Это создает новые вызовы для их выживания, так как они сталкиваются с конкуренцией за пищу и изменением экосистем. Ученые предупреждают, что такие изменения могут иметь каскадные эффекты на всю морскую пищевую цепь.",
      excerpt: "Наблюдается смещение ареалов обитания морских котиков из-за потепления океана.",
      date: "2025-10-25",
      imageUrl: "https://news.store.rambler.ru/img/3d022d8634d962b0001d1504ee71973e?img-format=auto&img-1-resize=height:400,fit:max&img-2-filter=sharpen"
    },
    {
      id: 5,
      title: "Успехи в реинтродукции белых медведей",
      content: "Проект по возвращению белых медведей в природу показывает впечатляющие результаты. За последние три года 47 медведей были успешно выпущены в дикую природу в Арктике. Все животные были отслеживаемы с помощью спутниковых ошейников, и 89% из них адаптировались к естественной среде. Проект стал возможен благодаря международному сотрудничеству и улучшению условий в зоопарках-партнерах.",
      excerpt: "Проект по возвращению белых медведей в природу показывает впечатляющие результаты.",
      date: "2025-10-24",
      imageUrl: "https://rg.ru/uploads/images/2022/11/02/1-599_6c8.jpg"
    },
    {
      id: 6,
      title: "Новые открытия в мире коралловых рифов",
      content: "Морские биологи обнаружили ранее неизвестные виды кораллов в глубинах Тихого океана. Эти кораллы, обитающие на глубине более 100 метров, обладают уникальной способностью выживать в условиях низкой освещенности и высокого давления. Ученые полагают, что открытие может привести к новым разработкам в области медицины, так как кораллы вырабатывают уникальные биоактивные соединения.",
      excerpt: "Морские биологи обнаружили ранее неизвестные виды кораллов в глубинах Тихого океана.",
      date: "2025-10-23",
      imageUrl: "https://cdnn21.img.ria.ru/images/149046/85/1490468556_0:243:2498:1660_1920x0_80_0_0_75f03260bf5fc63bd93efc814b8f8112.jpg"
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

  // Function to select random news items
  const selectRandomNews = (newsArray: NewsItem[], count: number): NewsItem[] => {
    const shuffled = [...newsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Function to simulate fetching news from an API
  const fetchNews = async (): Promise<NewsItem[]> => {
    // In a real implementation, this would be an API call:
    // const response = await fetch('https://api.animalpedia.com/news');
    // const data = await response.json();
    // return data;
    
    // For now, we'll use mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNewsData);
      }, 500); // Simulate network delay
    });
  };

  // Effect to load news on component mount
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        
        // Check if we have stored data for today
        const storedData = localStorage.getItem('dailyNews');
        const currentDate = getCurrentDate();
        
        if (storedData) {
          const parsedData: StoredNewsData = JSON.parse(storedData);
          
          // If stored data is from today, use it
          if (parsedData.date === currentDate) {
            setNews(parsedData.news);
            setLoading(false);
            return;
          }
        }
        
        // If no stored data or data is outdated, fetch new news
        const newsData = await fetchNews();
        const randomNews = selectRandomNews(newsData, 3);
        
        // Update news dates to current date
        const updatedNews = randomNews.map(newsItem => ({
          ...newsItem,
          date: currentDate
        }));
        
        // Store the new news with today's date
        const dataToStore: StoredNewsData = {
          date: currentDate,
          news: updatedNews
        };
        localStorage.setItem('dailyNews', JSON.stringify(dataToStore));
        
        setNews(updatedNews);
      } catch (error) {
        console.error("Failed to load news:", error);
        // Fallback to mock data if API fails
        const randomNews = selectRandomNews(mockNewsData, 3);
        const currentDate = getCurrentDate();
        const updatedNews = randomNews.map(newsItem => ({
          ...newsItem,
          date: currentDate
        }));
        setNews(updatedNews);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
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

  // Handle opening the modal with selected news
  const openModal = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section className={`py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Новости дня</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="nature-card animate-pulse flex flex-col h-full"
              >
                <div className={`h-48 w-full rounded-t-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className={`h-6 rounded w-3/4 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded w-full mb-2 flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded w-2/3 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-10 rounded w-1/2 mt-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'nature-text'}`}>Новости дня</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <div 
              key={item.id}
              className={`nature-card flex flex-col h-full
                ${index === 0 ? 'animate-fade-in-up delay-100' : 
                  index === 1 ? 'animate-fade-in-up delay-200' : 
                  'animate-fade-in-up delay-300'}`}
            >
              <div className="relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                  {formatDate(item.date)}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                <p className={`mb-4 flex-grow transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.excerpt}</p>
                <button 
                  onClick={() => openModal(item)}
                  className="nature-button inline-block"
                >
                  Читать далее →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying full news */}
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="nature-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-pop rounded-2xl">
            <div className="relative">
              <img 
                src={selectedNews.imageUrl} 
                alt={selectedNews.title} 
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                {formatDate(selectedNews.date)}
              </div>
              <button 
                onClick={closeModal}
                className={`absolute top-4 left-4 rounded-full p-2 shadow-lg hover:bg-opacity-80 transition-colors duration-200 ${
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
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedNews.title}</h3>
              <p className={`transition-colors duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DailyNews;