import React, { useState, useEffect } from 'react';
import { fetchGames } from '../api/gameService';
import { Game } from '../types';
import GameCard from './GameCard';
import ConsoleSEO from './ConsoleSEO';
import { Search, ArrowUpDown, Filter, X } from 'lucide-react';
import GameModal from './GameModal';

const Shop: React.FC = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsole, setSelectedConsole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [consoles, setConsoles] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Alphabetical pagination states
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Generate alphabet array
  const alphabet = ['all', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  useEffect(() => {
    loadAllGames();
  }, []);

  // Function to scroll to shop section
  const scrollToShop = () => {
    const shopElement = document.getElementById('shop');
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadAllGames = async () => {
    try {
      setLoading(true);
      const allGamesData = await fetchGames();
      const uniqueGames = allGamesData.reduce((acc: Game[], current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setAllGames(uniqueGames);
      
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

  const getLowestPrice = (game: Game): number => {
    const prices = ['price1', 'price2', 'price3', 'price4', 'price5', 'price6']
      .map(field => {
        const value = game[field as keyof Game];
        if (value) {
          const [, price] = value.split('-');
          return Number(price);
        }
        return Infinity;
      })
      .filter(price => price !== Infinity);

    return Math.min(...prices);
  };

  const sortGames = (games: Game[]) => {
    return [...games].sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = getLowestPrice(a);
        const priceB = getLowestPrice(b);
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
  };

  const toggleSort = (type: 'name' | 'price') => {
    if (sortBy === type) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
    scrollToShop();
    setShowMobileFilters(false);
  };

  const handleConsoleChange = (console: string) => {
    setSelectedConsole(console);
    setSelectedLetter('all'); // Reset letter filter when console changes
    setShowMobileFilters(false);
    scrollToShop();
  };

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter);
    setShowMobileFilters(false);
    scrollToShop();
  };

  // Client-side filtering - no API calls needed
  const filteredGames = allGames.filter(game => {
    // Console filter
    if (selectedConsole !== 'all' && game.console !== selectedConsole) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!(
        game.name.toLowerCase().includes(query) ||
        game.console.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      )) {
        return false;
      }
    }

    // Letter filter
    if (selectedLetter !== 'all') {
      const firstLetter = game.name.charAt(0).toUpperCase();
      if (firstLetter !== selectedLetter) {
        return false;
      }
    }

    return true;
  });

  const sortedGames = sortGames(filteredGames);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowMobileFilters(false);
    scrollToShop();
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setShowMobileFilters(false);
    scrollToShop();
  };

  // Calculate displayed games based on items per page
  const displayedGames = sortedGames.slice(0, itemsPerPage);

  return (
    <section id="shop" className="py-16 bg-gray-800">
      <ConsoleSEO console={selectedConsole} />
      <div className="sticky top-20 z-40 bg-gray-800 py-4 shadow-lg">
        <div className="container mx-auto px-4">
          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden mb-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                {showMobileFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                <span className="hidden sm:inline">
                  {showMobileFilters ? 'Close' : 'Filters'}
                </span>
              </button>
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="mt-4 bg-gray-700 rounded-lg p-4 space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Console</label>
                  <select
                    value={selectedConsole}
                    onChange={(e) => handleConsoleChange(e.target.value)}
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {consoles.map(console => (
                      <option key={console} value={console}>
                        {console === 'all' ? 'All Consoles' : console}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Letter</label>
                  <select
                    value={selectedLetter}
                    onChange={(e) => handleLetterChange(e.target.value)}
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {alphabet.map(letter => (
                      <option key={letter} value={letter}>
                        {letter === 'all' ? 'All Letters' : letter}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSort('name')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        sortBy === 'name' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      Name
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSort('price')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        sortBy === 'price' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      Price
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Items to show</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                    <option value={96}>96</option>
                    <option value={sortedGames.length}>All ({sortedGames.length})</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              <select
                id="console-select"
                value={selectedConsole}
                onChange={(e) => handleConsoleChange(e.target.value)}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 md:w-48"
              >
                {consoles.map(console => (
                  <option key={console} value={console}>
                    {console === 'all' ? 'All Consoles' : console}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSort('name')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    sortBy === 'name' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSort('price')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    sortBy === 'price' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Price
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alphabetical Filter */}
            <div className="flex flex-wrap gap-1">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleLetterChange(letter)}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    selectedLetter === letter
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {letter === 'all' ? 'All' : letter}
                </button>
              ))}
            </div>

            {/* Items per page and info */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">Items to show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                  <option value={sortedGames.length}>All ({sortedGames.length})</option>
                </select>
              </div>

              <div className="text-gray-300 text-sm">
                Showing {Math.min(displayedGames.length, sortedGames.length)} of {sortedGames.length} games
              </div>
            </div>
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

        {!loading && !error && displayedGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No games found matching your criteria
          </div>
        )}

        {!loading && !error && displayedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        )}

        {/* Show more button if there are more games */}
        {!loading && !error && sortedGames.length > displayedGames.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setItemsPerPage(sortedGames.length)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Show All {sortedGames.length} Games
            </button>
          </div>
        )}

        {/* Mobile info */}
        <div className="md:hidden text-center text-gray-300 text-sm mt-4">
          Showing {Math.min(displayedGames.length, sortedGames.length)} of {sortedGames.length} games
        </div>
      </div>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </section>
  );
};

export default Shop;