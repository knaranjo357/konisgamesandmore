import React from 'react';
import { Game, PRICE_CATEGORIES } from '../../types';
import { Search, SortAsc, SortDesc, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

interface GamesListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (rowNumber: number) => void;
  consoles: string[];
  onConsoleChange?: (console: string) => void;
  loading?: boolean;
}

const GamesList: React.FC<GamesListProps> = ({ 
  games, 
  onEdit, 
  onDelete, 
  consoles,
  onConsoleChange,
  loading = false
}) => {
  const [selectedConsole, setSelectedConsole] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'cover' | 'rating' | 'console'>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(12);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleConsoleChange = (console: string) => {
    setSelectedConsole(console);
    setCurrentPage(1);
    setShowMobileFilters(false);
    if (onConsoleChange) {
      onConsoleChange(console);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setShowMobileFilters(false);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = filteredAndSortedGames.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Games List</h2>
      
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 p-3 pr-10 rounded"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded transition-colors flex items-center gap-2"
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
                <option value="all">All Consoles</option>
                {consoles.map((console, index) => (
                  <option key={index} value={console}>
                    {console}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('name')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    sortField === 'name' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  Name
                  {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
                <button
                  onClick={() => handleSort('console')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    sortField === 'console' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  Console
                  {sortField === 'console' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Items per page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 p-3 pr-10 rounded"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={selectedConsole}
            onChange={(e) => handleConsoleChange(e.target.value)}
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

        <div className="flex justify-between items-center">
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
              onClick={() => handleSort('console')}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                sortField === 'console' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              Console {sortField === 'console' && (sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <div className="text-gray-300 text-sm">
              Showing {Math.min(startIndex + 1, filteredAndSortedGames.length)}-{Math.min(endIndex, filteredAndSortedGames.length)} of {filteredAndSortedGames.length} games
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[800px] overflow-y-auto">
          {currentGames.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No games found matching your criteria
            </div>
          ) : (
            currentGames.map(game => (
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
      )}

      {/* Bottom Pagination for Mobile */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8 md:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded text-sm ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile pagination info */}
      <div className="md:hidden text-center text-gray-300 text-sm mt-4">
        Showing {Math.min(startIndex + 1, filteredAndSortedGames.length)}-{Math.min(endIndex, filteredAndSortedGames.length)} of {filteredAndSortedGames.length} games
      </div>
    </div>
  );
};

export default GamesList;