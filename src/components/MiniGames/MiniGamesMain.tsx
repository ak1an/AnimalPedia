import React from 'react';
import { Quiz, MiniQuest } from './index';

const MiniGamesMain: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold nature-text mb-2">Мини-игры</h2>
          <p className="nature-text-light">
            Проверьте свои знания о животных в увлекательных играх
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quiz Game Card */}
          <div className="nature-card transform transition-all duration-300 hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Викторина</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ответьте на 12 случайных вопросов о животных. У вас есть 10 секунд на каждый вопрос!
              </p>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Вопросов</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Время на вопрос</span>
                  <span>10 секунд</span>
                </div>
              </div>
              <Quiz />
            </div>
          </div>
          
          {/* Mini Quest Game Card */}
          <div className="nature-card transform transition-all duration-300 hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Миниквест</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Пройдите увлекательные задания и проверьте свои знания о животных!
              </p>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Заданий</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Типы заданий</span>
                  <span>Разные</span>
                </div>
              </div>
              <MiniQuest />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniGamesMain;