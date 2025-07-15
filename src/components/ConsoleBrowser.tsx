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
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedConsoleForMessage, setSelectedConsoleForMessage] = useState<ConsoleItem | null>(null);

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

        // Get unique consoles and sort alphabetically
        const uniqueConsoles = Array.from(new Set(uniqueGames.map(game => game.console)))
          .sort((a, b) => a.localeCompare(b))
          .map(consoleName => ({
            name: consoleName,
            slug: consoleName.toLowerCase().replace(/\s+/g, '-'),
            image: uniqueGames.find(game => game.console === consoleName && game.console_url)?.console_url || ''
          }));
        setConsoles(uniqueConsoles);
      } catch (error) {
        console.error('Error loading consoles:', error);
      }
    };

    loadConsoles();
  }, []);

  const handleConsoleClick = (console: ConsoleItem) => {
    // Check for specific console messages
    if (console.name.toLowerCase() === 'playstation2' || console.name.toLowerCase() === 'playstation 2') {
      setMessageContent('Just want to make sure you know that you need a Free Mcboot to play burnt games on the PS2. Any questions please feel free to ask. Also you need the right model of PS2.');
      setSelectedConsoleForMessage(console);
      setShowMessage(true);
      return;
    }
    
    if (console.name.toLowerCase() === 'sega saturn') {
      setMessageContent('Just want to make sure you know, you need a action replay with Psuedo Kia programmed onto it to play burnt games at Sega Saturn.');
      setSelectedConsoleForMessage(console);
      setShowMessage(true);
      return;
    }

    // Normal console navigation - now uses client-side filtering
    navigateToShop(console);
  };

  const navigateToShop = (console: ConsoleItem) => {
    const shopElement = document.getElementById('shop');
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' });
      
      // Update the console select element - this will now trigger client-side filtering
      setTimeout(() => {
        const selectElement = document.getElementById('console-select') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = console.name;
          // Trigger change event to update the filter
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 100);
    }
  };

  const closeMessageAndNavigate = () => {
    setShowMessage(false);
    setMessageContent('');
    
    // Navigate to shop with the selected console filter - now uses client-side filtering
    if (selectedConsoleForMessage) {
      navigateToShop(selectedConsoleForMessage);
    }
    
    setSelectedConsoleForMessage(null);
  };

  return (
    <>
      <section className="py-16 bg-gray-900" id="consoles">
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

      {/* Console Message Modal */}
      {showMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {messageContent}
              </p>
              <button
                onClick={closeMessageAndNavigate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsoleBrowser;
