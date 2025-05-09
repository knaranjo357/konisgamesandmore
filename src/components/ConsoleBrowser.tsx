import React, { useState, useEffect } from 'react';
import { fetchGames } from '../api/gameService';
import { Game } from '../types';

interface ConsoleItem {
  name: string;
  slug: string;
  image: string;
}

interface Props {
  onConsoleSelect?: (console: string) => void;
}

const ConsoleBrowser: React.FC<Props> = ({ onConsoleSelect }) => {
  const [consoles, setConsoles] = useState<ConsoleItem[]>([]);

  useEffect(() => {
    const loadConsoles = async () => {
      try {
        const games = await fetchGames();
        // Remove duplicates from games first
        const uniqueGames = games.reduce((acc: Game[], current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        // Get unique consoles
        const uniqueConsoles = Array.from(new Set(uniqueGames.map(game => game.console)))
          .map(consoleName => ({
            name: consoleName,
            slug: consoleName.toLowerCase().replace(/\s+/g, '-'),
            image: uniqueGames.find(game => game.console === consoleName)?.console_url || ''
          }));
        setConsoles(uniqueConsoles);
      } catch (error) {
        console.error('Error loading consoles:', error);
      }
    };

    loadConsoles();
  }, []);

  const handleConsoleClick = (console: ConsoleItem) => {
    const shopElement = document.getElementById('shop');
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' });
      
      // Update the console select element
      const selectElement = document.getElementById('console-select') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = console.name;
        // Trigger change event
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Browse by Console</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {consoles.map((console) => (
            <button 
              key={console.slug}
              onClick={() => handleConsoleClick(console)}
              className="bg-gray-800 rounded-lg p-4 transform transition duration-300 hover:scale-105 group flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-gray-700 group-hover:border-purple-500 transition-colors">
                <img 
                  src={console.image} 
                  alt={console.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-center text-sm font-medium text-gray-300 group-hover:text-purple-400 transition-colors">
                {console.name}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsoleBrowser;