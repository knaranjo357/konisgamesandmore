import React from 'react';
import { Game, PRICE_CATEGORIES } from '../../types';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface GamesListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (rowNumber: number) => void;
  consoles: string[];
}

const GamesList: React.FC<GamesListProps> = ({ games, onEdit, onDelete, consoles }) => {
  const [selectedConsole, setSelectedConsole] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'cover' | 'rating' | 'console'>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedGames = games
    .filter(game => {
      const matchesConsole = selectedConsole === 'all' || game.console === selectedConsole;
      const matchesSearch = searchQuery === '' || 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesConsole && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Games List</h2>
      
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 p-3 pr-10 rounded"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={selectedConsole}
            onChange={(e) => setSelectedConsole(e.target.value)}
            className="bg-gray-700 p-3 rounded min-w-[150px]"
          >
            <option value="all">All Consoles</option>
            {consoles.map((console, index) => (
              <option key={index} value={console}>
                {console}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              sortField === 'name' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Name {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
          <button
            onClick={() => handleSort('cover')}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              sortField === 'cover' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Price {sortField === 'cover' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
          <button
            onClick={() => handleSort('rating')}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              sortField === 'rating' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Rating {sortField === 'rating' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
          <button
            onClick={() => handleSort('console')}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              sortField === 'console' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Console {sortField === 'console' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-[800px] overflow-y-auto">
        {filteredAndSortedGames.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No games found
          </div>
        ) : (
          filteredAndSortedGames.map(game => (
            <div key={game.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex gap-4">
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logokonisgames.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  <p className="text-gray-300">{game.console}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PRICE_CATEGORIES.map(category => (
                      game[category.value] && (
                        <p key={category.value} className="text-sm">
                          <span className="text-gray-400">{category.label}:</span>
                          <span className="text-purple-400 ml-1">${game[category.value]}</span>
                        </p>
                      )
                    ))}
                    {/* Display custom categories */}
                    {['price1', 'price2', 'price3'].map((field, index) => {
                      const value = game[field as keyof Game];
                      if (value && typeof value === 'string') {
                        const [name, price] = value.split('-');
                        return (
                          <p key={field} className="text-sm">
                            <span className="text-gray-400">{name}:</span>
                            <span className="text-purple-400 ml-1">${price}</span>
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onEdit(game)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(game.row_number)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GamesList;