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
        const uniqueGames = games.reduce((acc: Game[], current) => {
          const x = acc.find(item => item.id === current.id);
          return !x ? acc.concat([current]) : acc;
        }, []);

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
    if (console.name.toLowerCase().includes('playstation 2')) {
      setMessageContent('Note: You need a Free McBoot card to play burnt games on PS2.');
      setSelectedConsoleForMessage(console);
      setShowMessage(true);
      return;
    }
    if (console.name.toLowerCase().includes('sega saturn')) {
      setMessageContent('Note: You need an Action Replay with Pseudo Kai to play burnt games on Saturn.');
      setSelectedConsoleForMessage(console);
      setShowMessage(true);
      return;
    }
    navigateToShop(console);
  };

  const navigateToShop = (console: ConsoleItem) => {
    const shopElement = document.getElementById('shop');
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const selectElement = document.getElementById('console-select') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = console.name;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 100);
    }
  };

  const closeMessageAndNavigate = () => {
    setShowMessage(false);
    if (selectedConsoleForMessage) navigateToShop(selectedConsoleForMessage);
    setSelectedConsoleForMessage(null);
  };

  return (
    <>
      <section className="py-20 bg-gray-900 relative" id="consoles">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/5 to-gray-800 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Browse by Console</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {consoles.map((console) => (
              <button 
                key={console.slug}
                onClick={() => handleConsoleClick(console)}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-gray-800 border border-white/5 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col items-center justify-center"
              >
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-purple-500 transition-colors relative z-10 bg-gray-900">
                    <img src={console.image} alt={console.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <h3 className="text-center text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {console.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Message */}
      {showMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Good to know!</h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">{messageContent}</p>
              <button
                onClick={closeMessageAndNavigate}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/25"
              >
                Understood, take me there
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsoleBrowser;