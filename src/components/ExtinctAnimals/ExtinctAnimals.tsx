import React from 'react';
import { Link } from 'react-router-dom';
import extinctAnimalsData from '../../data/extinctAnimals.json';

const ExtinctAnimals: React.FC = () => {
  // Get first 5 extinct animals
  const animals = extinctAnimalsData.slice(0, 5);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold nature-text mb-2">Вымершие животные</h2>
          <p className="nature-text-light">
            Животные, которых больше нет на Земле
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {animals.map((animal) => (
            <div 
              key={animal.id}
              className="nature-card transform transition-all duration-300 hover:scale-105 flex flex-col h-full"
            >
              <div className="relative">
                <img 
                  src={animal.photo} 
                  alt={animal.name} 
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{animal.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{animal.habitat}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">{animal.short}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/categories"
            className="nature-button inline-block"
          >
            Посмотреть больше
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExtinctAnimals;