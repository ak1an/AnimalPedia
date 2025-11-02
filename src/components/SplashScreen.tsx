import React, { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Automatically hide splash screen after 4 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden opacity-0 animate-fade-in">
      {/* Animated background with nature gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-green-50 to-green-400">
        {/* Sun rays */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-200 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Floating nature elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating bees */}
        <div className="absolute top-1/4 left-1/3 w-6 h-6 text-yellow-500 opacity-70 animate-float-bee" style={{ animationDelay: '0s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M2 12C2 10.9 2.9 10 4 10S6 10.9 6 12 5.1 14 4 14 2 13.1 2 12M20 10C18.9 10 18 10.9 18 12S18.9 14 20 14 22 13.1 22 12 21.1 10 20 10M12 18C10.9 18 10 18.9 10 20S10.9 22 12 22 14 21.1 14 20 13.1 18 12 18M7 7C8.1 7 9 7.9 9 9S8.1 11 7 11 5 10.1 5 9 5.9 7 7 7M17 7C18.1 7 19 7.9 19 9S18.1 11 17 11 15 10.1 15 9 15.9 7 17 7M7 15C8.1 15 9 15.9 9 17S8.1 19 7 19 5 18.1 5 17 5.9 15 7 15M17 15C18.1 15 19 15.9 19 17S18.1 19 17 19 15 18.1 15 17 15.9 15 17 15Z" />
          </svg>
        </div>
        
        {/* Floating leaves */}
        <div className="absolute top-1/3 right-1/4 w-8 h-8 text-green-600 opacity-60 animate-float-leaf" style={{ animationDelay: '0.5s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 20,3 20,3C20,3 19.87,12.17 17,8Z" />
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4 w-6 h-6 text-green-500 opacity-50 animate-float-leaf" style={{ animationDelay: '1.5s', animationDuration: '12s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 20,3 20,3C20,3 19.87,12.17 17,8Z" />
          </svg>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/5 right-1/3 w-3 h-3 bg-white rounded-full opacity-80 animate-float-particle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-200 rounded-full opacity-70 animate-float-particle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-green-300 rounded-full opacity-60 animate-float-particle" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Logo with animation */}
        <div className="mb-8 transform opacity-0 animate-fade-in-up">
          <img 
            src="https://cdn-icons-png.flaticon.com/128/14684/14684285.png" 
            alt="Animalpedia Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 transform opacity-0 animate-fade-in-up-text drop-shadow-lg">
          Добро пожаловать в Animalpedia
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-700 max-w-md transform opacity-0 animate-fade-in-up-subtext drop-shadow-md">
          Здесь вы узнаете удивительные факты о животных и природе
        </p>
      </div>
      
      {/* Custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatBee {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(15px) rotate(10deg); }
          50% { transform: translateY(-40px) translateX(30px) rotate(0deg); }
          75% { transform: translateY(-20px) translateX(15px) rotate(-10deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        
        @keyframes floatLeaf {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(-10px) rotate(15deg); }
          50% { transform: translateY(-30px) translateX(-20px) rotate(0deg); }
          75% { transform: translateY(-15px) translateX(-10px) rotate(-15deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-25px) translateX(10px); }
          50% { transform: translateY(-50px) translateX(20px); }
          75% { transform: translateY(-25px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.5s forwards;
        }
        
        .animate-fade-in-up-text {
          animation: fadeInUp 1s ease-out 1s forwards;
        }
        
        .animate-fade-in-up-subtext {
          animation: fadeInUp 1s ease-out 1.5s forwards;
        }
        
        .animate-float-bee {
          animation: floatBee 8s ease-in-out infinite;
        }
        
        .animate-float-leaf {
          animation: floatLeaf 10s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: floatParticle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;