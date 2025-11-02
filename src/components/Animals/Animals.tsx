import React from 'react';
import { Link } from 'react-router-dom';
import mammalsData from '../../data/mammals.json';
import birdsData from '../../data/birds.json';
import reptilesData from '../../data/reptiles.json';
import amphibiansData from '../../data/amphibians.json';
import fishData from '../../data/fish.json';
import insectsData from '../../data/insects.json';

// Combine all animal data and take first 5
const allAnimals = [
  ...mammalsData,
  ...birdsData,
  ...reptilesData,
  ...amphibiansData,
  ...fishData,
  ...insectsData
];

const Animals: React.FC = () => {
  // Get first 5 animals
  const animals = allAnimals.slice(0, 5);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold nature-text mb-2">Животные</h2>
          <p className="nature-text-light">
            Познакомьтесь с удивительным миром животных
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
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{animal.habitat}</p>
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

export default Animals;