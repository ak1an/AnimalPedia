import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ForestLogo, DesertLogo, SavannaLogo, OceanLogo } from './logos';

// Define types
interface Animal {
  id: string;
  name: string;
  habitat: string;
  photo: string;
  short: string;
}

const Habitat: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Habitat data with colors and logos (only 4 categories in required order)
  const habitats = [
    { 
      name: "Лес", 
      color: "from-green-500 to-emerald-600",
      darkColor: "from-green-600 to-emerald-700",
      icon: <ForestLogo className="h-6 w-6" />
    },
    { 
      name: "Пустыня", 
      color: "from-amber-500 to-orange-600",
      darkColor: "from-amber-600 to-orange-700",
      icon: <DesertLogo className="h-6 w-6" />
    },
    { 
      name: "Саванна", 
      color: "from-yellow-500 to-amber-600",
      darkColor: "from-yellow-600 to-amber-700",
      icon: <SavannaLogo className="h-6 w-6" />
    },
    { 
      name: "Океан", 
      color: "from-blue-500 to-cyan-600",
      darkColor: "from-blue-600 to-cyan-700",
      icon: <OceanLogo className="h-6 w-6" />
    }
  ];

  // Fetch animals from JSON files
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        
        // Import all animal data files
        const mammals = await import('../../data/mammals.json');
        const birds = await import('../../data/birds.json');
        const reptiles = await import('../../data/reptiles.json');
        const amphibians = await import('../../data/amphibians.json');
        const fish = await import('../../data/fish.json');
        const insects = await import('../../data/insects.json');
        const extinct = await import('../../data/extinctAnimals.json');
        
        // Combine all animals with only the needed fields
        const allAnimals: Animal[] = [
          ...mammals.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...birds.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...reptiles.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...amphibians.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...fish.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...insects.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          })),
          ...extinct.default.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            habitat: animal.habitat,
            photo: animal.photo,
            short: animal.short
          }))
        ];
        
        setAnimals(allAnimals);
      } catch (error) {
        console.error("Error loading animals:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnimals();
  }, []);

  // Get 5 random animals for a specific habitat
  const getPreviewAnimals = (habitatName: string) => {
    const filtered = animals.filter(a => a.habitat === habitatName);
    
    // Shuffle array to get random animals
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    // Return first 5 animals
    return shuffled.slice(0, 5);
  };

  // Navigate to habitat filter page
  const navigateToHabitatFilter = (habitat: string) => {
    // Store the selected habitat in localStorage
    localStorage.setItem('selectedHabitat', habitat);
    navigate('/habitat-filter');
  };

  return (
    <section id="habitat-section" className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold nature-text mb-2">Среда обитания</h2>
          <p className="nature-text-light">
            Исследуйте животных в их естественной среде обитания
          </p>
        </div>
        
        {/* Habitat Categories with Preview Animals */}
        <div className="space-y-16">
          {habitats.map((habitat) => {
            const previewAnimals = getPreviewAnimals(habitat.name);
            
            return (
              <div key={habitat.name} className="nature-card">
                {/* Habitat Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${habitat.color} dark:${habitat.darkColor} text-white mr-4`}>
                      {habitat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{habitat.name}</h3>
                  </div>
                  
                  <button
                    onClick={() => navigateToHabitatFilter(habitat.name)}
                    className="nature-button mt-4 md:mt-0"
                  >
                    Показать больше
                  </button>
                </div>
                
                {/* Animals Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div 
                        key={item} 
                        className="nature-card animate-pulse"
                      >
                        <div className="bg-gray-300 dark:bg-gray-700 h-48 w-full rounded-t-2xl"></div>
                        <div className="p-4">
                          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : previewAnimals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {previewAnimals.map((animal, index) => (
                      <motion.div 
                        key={animal.id}
                        className="nature-card hover:scale-105 transition-all duration-300 flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        layout
                      >
                        <div className="relative">
                          <img 
                            src={animal.photo} 
                            alt={animal.name} 
                            className="h-48 w-full object-cover rounded-t-2xl"
                          />
                        </div>
                        
                        <div className="p-4 flex-grow flex flex-col">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{animal.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{animal.short}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Нет доступных животных для этой среды обитания
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Habitat;