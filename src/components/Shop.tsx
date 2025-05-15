import React, { useState, useEffect } from 'react';
import { fetchGames } from '../api/gameService';
import { Game } from '../types';
import GameCard from './GameCard';
import { Search } from 'lucide-react';

const Shop: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsole, setSelectedConsole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [consoles, setConsoles] = useState<string[]>([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const allGames = await fetchGames();
        // Remove duplicates based on id
        const uniqueGames = allGames.reduce((acc: Game[], current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        // Sort games alphabetically by name
        const sortedGames = uniqueGames.sort((a, b) => a.name.localeCompare(b.name));
        setGames(sortedGames);
        
        // Get unique consoles and sort alphabetically
        const uniqueConsoles = Array.from(new Set(uniqueGames.map(game => game.console)))
          .sort((a, b) => a.localeCompare(b));
        setConsoles(['all', ...uniqueConsoles]);
        setError(null);
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const filteredGames = games.filter(game => {
    // Strict console matching
    if (selectedConsole !== 'all' && game.console !== selectedConsole) {
      return false;
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        game.name.toLowerCase().includes(query) ||
        game.console.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <section id="shop" className="py-16 bg-gray-800">
      <div className="sticky top-20 z-40 bg-gray-800 py-4 shadow-lg">
        <div className="container mx-auto px-4">          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            <select
              id="console-select"
              value={selectedConsole}
              onChange={(e) => setSelectedConsole(e.target.value)}
              className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 md:w-48"
            >
              {consoles.map(console => (
                <option key={console} value={console}>
                  {console === 'all' ? 'All Consoles' : console}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg max-w-md mx-auto text-center">
            {error}
          </div>
        )}

        {!loading && !error && filteredGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No games found matching your criteria
          </div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;